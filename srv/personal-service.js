const cds = require('@sap/cds')
module.exports = async (srv) => {

    const { PerPersonal } = srv.entities;

    //Set APIKey for all requests
    cds.env.requires.ECPersonalInformation.credentials.headers = {
        APIKey: process.env.APIKey
    };

    const ECPersonalInformation = await cds.connect.to('ECPersonalInformation')

    //const sqliteDB = await cds.connect.to('db');

    srv.on(['READ'], PerPersonal, async (req) => {
        try {
            const tx = ECPersonalInformation.tx(req);
            const query = req.query.SELECT;
            const from = query.from;
            const groupBy = query.groupBy || [];
            const columns = query.columns || [];
            const orderBy = query.orderBy || [];
            const where = query.where || [];


            //Query only with supported OData v2 features
            const v2Query = SELECT
                .from(from)
                .columns(columns)
                .orderBy(orderBy)
                //.limit(5000)
                .where(where);

            //Execute query in OData v2
            const results = await tx.run(v2Query);

            //Complete Computed fields
            results.forEach(item => item.__AGGREGATION__NumberOfPersons = 1);

            //Aggregate results if needed
            const selectedColumns = groupBy.concat(columns.filter(c => !c.func)).map(c => c.ref[0]);
            const groupByCols = Array.from(new Set(selectedColumns));
            const aggregatedCols = query.columns.filter(c => c.func).map(c => c.as);

            let aggregatedResults = [];

            if (groupByCols.length > 0) {

                //Reduce (aggregate) results
                aggregatedResults = results.reduce((aggrItems, currentItem) => {
                    //Generate Object with Keys
                    const currentItemKeyObject = groupByCols.reduce((keyObject, col) => {
                        keyObject[col] = currentItem[col]
                        return keyObject;
                    }, {});
                    //Generate String Key to easy access object
                    const currentItemKey = JSON.stringify(currentItemKeyObject);
                    //Use key to find existing object in Aggregated list
                    const existingItem = aggrItems.find(aggrItem => aggrItem._key === currentItemKey);

                    //If item exists, summarize
                    if (existingItem) {
                        aggregatedCols.forEach(aggrCol => {
                            //SUM
                            existingItem[aggrCol] = existingItem[aggrCol] + currentItem[aggrCol];
                        })
                    } else { //If item does not exist, set new item
                        let newItem = {};
                        newItem._key = currentItemKey;
                        //Add groupBy/aggregated cols to item
                        aggregatedCols.concat(groupByCols).forEach(aggrCol => {
                            newItem[aggrCol] = currentItem[aggrCol];
                        });
                        aggrItems.push(newItem);
                    }

                    return aggrItems;
                }, []);

            } else {
                aggregatedResults = results;
            }

            //Limit according to $top and $skip
            if (query.limit) {
                const top = query.limit.rows.val;
                const skip = query.limit.offset.val;
                aggregatedResults = aggregatedResults.slice(skip, skip + top);
            }

            //Set count of the final response
            aggregatedResults.$count = results.length;

            return aggregatedResults;
        } catch (err) {
            req.error(err.code, err.message);
        }
    })
}