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
            .columns((personal) => {
                personal.personIdExternal,
                    personal.firstName,
                    personal.lastName,
                    personal.initials,
                    personal.displayName,
                    personal.title,
                    personal.gender,
                    personal.maritalStatus,
                    personal.nationality,
                    personal.personNav((person) => {
                        person.dateOfBirth
                    }),
                    personal.maritalStatusNav((maritalStatus) => {
                        maritalStatus.picklistLabels((picklist) => {
                            picklist.locale,
                            picklist.label
                        })
                    })
            })
            .from("ECPersonalInformation.PerPersonal")
        //.where(requestQuery.where || []);

        //Get Total Count of the OData V2 Records
        const totalCount = await getTotalCount(tx, v2Query);

        //Get entire external result set
        let externalResults = await tx.run(v2Query);

        //Transformation
        externalResults = externalResults.map(personal => {
            const dateOfBirth = personal.personNav.dateOfBirth;
            const yearOfBirth = dateOfBirth && Number(dateOfBirth.substring(0, 4));
            const genderDescr = {
                "M": "Masculine",
                "F": "Femenine"
            }[personal.gender] || "";
            const maritalStatusTexts = personal.maritalStatusNav && personal.maritalStatusNav.picklistLabels;
            const maritalStatusText = maritalStatusTexts && maritalStatusTexts.find(maritalStatusText => maritalStatusText.locale === 'en_US');
            const maritalStatusDescr = maritalStatusText && maritalStatusText.label;
            return {
                PersonalId: personal.personIdExternal,
                FirstName: personal.firstName,
                LastName: personal.lastName,
                Initials: personal.initials,
                DisplayName: personal.displayName,
                PersonalTitle: personal.title,
                Gender: personal.gender,
                GenderDescr: genderDescr,
                MaritalStatus: personal.maritalStatus,
                MaritalStatusDescr: maritalStatusDescr,
                Nationality: personal.nationality,
                DateOfBirth: dateOfBirth,
                YearOfBirth: yearOfBirth,
                NumberOfPersons: 1
            }
        });

        //Aggregate data according to request query parameters
        const aggrResults = await getAggregatedResults(PerPersonal, requestQuery, externalResults);

        //Assign count to response
        aggrResults.$count = totalCount;

        return aggrResults;

    });
}