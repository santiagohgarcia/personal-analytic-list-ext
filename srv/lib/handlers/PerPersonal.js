const cds = require('@sap/cds');

const { PersonalService } = require('../../personal-service');

//Set APIKey for all requests
cds.env.requires.ECPersonalInformation.credentials.headers = {
    APIKey: process.env.APIKey
};

let ECPersonalInformation;

(async function () {
    // Connect to external SFSF OData services
    ECPersonalInformation = await cds.connect.to('ECPersonalInformation');
})();

/*** HANDLERS ***/

// Read PerPersonal
async function readPerPersonal(req) {
    try {
        const tx = ECPersonalInformation.tx(req);
        const query = req.query.SELECT;
        let groupByFields = [];

        //OData v2 total query
        const v2TotalQuery = SELECT
            .from(query.from)
            .where(query.where || [])
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
        const pageSize = 500;
        let offset = 0;

        while (offset <= totalCount) {
            console.log("Query PerPersonal from " + offset + " page " + pageSize)
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
        await DELETE.from(PersonalService.PerPersonal);
        await INSERT.into(PersonalService.PerPersonal).entries(results);

        //TODO: groupby was not working completely, so we do it like this for now
        if (query.groupBy) {
            groupByFields = query.groupBy.map(groupByObject => groupByObject.ref[0]);
        }

        const aggrResults = await SELECT
            .from(PersonalService.PerPersonal)
            .columns(query.columns)
            .groupBy(...groupByFields)
            .limit(query.limit)
            .orderBy(query.orderBy);

        await DELETE.from(PersonalService.PerPersonal);

        aggrResults.$count = totalCount;

        return aggrResults;

    } catch (err) {
        req.error(err.code, err.message);

        await DELETE.from(PersonalService.PerPersonal);
    }
}

module.exports = {
    readPerPersonal
}