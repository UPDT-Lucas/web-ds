require('dotenv').config(); 
const { appConfig, dbConfig } = require('./config');
const app = require('./app');
const MongoConnection = require('./db/class_db'); 
const Student = require('./Models/Student');

async function initApp(appConfig, dbConfig) {
    try {

        const mongoConnection = new MongoConnection({
            user: "proyecto_diseno",
            password: "MLdmnzq3DcLU7Jqw",
            address: "cluster0.cj7hwee.mongodb.net",
            nameDB: "proyecto_diseno"
        });
        

        await mongoConnection.connect();

      

        app.listen(appConfig.port, () => console.log(`Listening on http://localhost:${appConfig.port}`));
    } catch (error) {
        console.error(error);
        process.exit(0);
    }
}

initApp(appConfig, dbConfig);