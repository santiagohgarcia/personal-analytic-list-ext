const cds = require('@sap/cds')
module.exports = async (srv) => {

    const { PerPersonal } = srv.entities;

    //Set APIKey for all requests
    cds.env.requires.ECPersonalInformation.credentials.headers = {
        APIKey: process.env.APIKey
    };

    const ECPersonalInformation = await cds.connect.to('ECPersonalInformation')

    srv.on(['READ'], PerPersonal, async (req) => {
        try {
            const tx = ECPersonalInformation.tx(req);
            const query = req.query.SELECT;
            let groupByFields = [];

            //OData v2 total query
            const v2TotalQuery = SELECT
                .from(query.from)
                .columns({
                    func: "count",
                    args: [
                        {
                            val: "1",
                        },
                    ],
                    as: "$count",
                });
            const totalCountResult = await tx.run(v2TotalQuery);
            const totalCount = totalCountResult[0] ? totalCountResult[0].$count : 0;

            //Query only with supported OData v2 features, in paginated mode to improve performance
            const v2Queries = [];
            const pageSize = 1000;
            let offset = 0;

            while (offset <= totalCount) {
                v2Queries.push(
                    tx.run(SELECT
                        .from(query.from)
                        .limit(pageSize, offset)
                        .where(query.where || []))
                );
                offset = offset + pageSize;
            }

            //Execute query in OData v2 External Service
            const queriesResults = await Promise.all(v2Queries);
            const results = queriesResults.flat();

            results.forEach(item => item.NumberOfPersons = 1);

            //Insert records into SQLLITE to execute query using framework
            await DELETE.from(PerPersonal);
            await INSERT.into(PerPersonal).entries(results);

            //TODO: groupby was not working completely, so we do it like this for now
            if (query.groupBy) {
                groupByFields = query.groupBy.map(groupByObject => groupByObject.ref[0]);
            }

            const aggrResults = await SELECT
                .from(PerPersonal)
                .columns(query.columns)
                .groupBy(...groupByFields)
                .limit(query.limit)
                .orderBy(query.orderBy);

            await DELETE.from(PerPersonal);

            aggrResults.$count = totalCount;

            return aggrResults;

        } catch (err) {
            req.error(err.code, err.message);

            await DELETE.from(PerPersonal);
        }


    })
}