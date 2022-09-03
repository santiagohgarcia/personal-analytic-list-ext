const cds = require('@sap/cds');

//Set APIKey for all requests
cds.env.requires.ECPersonalInformation.credentials.headers = {
    APIKey: process.env.APIKey
};

const {
    getTotalCount,
    getAggregatedResults
} = require('./lib/helpers/Aggregator');

module.exports = async (srv) => {
    //External Service
    const ECPersonalInformation = await cds.connect.to('ECPersonalInformation');

    //Local Entities
    const { PerPersonal } = srv.entities;

    srv.on(['READ'], PerPersonal, async (req) => {
        const tx = ECPersonalInformation.tx(req);
        const requestQuery = req.query.SELECT;

        //Prepare OData V2 Query 
        const v2Query = SELECT
            .from(requestQuery.from)
            .where(requestQuery.where || []);

        //Get Total Count of the OData V2 Records
        const totalCount = await getTotalCount(tx, v2Query);

        //Get entire external result set
        const externalResults = await tx.run(v2Query);

        //Transformation
        externalResults.forEach(item => {
            
            item.GenderDescr = {
                "M": "Masculine",
                "F": "Femenine"
            }[item.Gender] || ""

            item.NumberOfPersons = 1
        });

        //Aggregate data according to request query parameters
        const aggrResults = getAggregatedResults(PerPersonal, requestQuery, externalResults);

        //Assign count to response
        aggrResults.$count = totalCount;

        return aggrResults;

    });
}