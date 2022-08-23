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
            tx.run(req.query);
        } catch (err) {
            req.error(err.code, err.message);
        }
    })
}