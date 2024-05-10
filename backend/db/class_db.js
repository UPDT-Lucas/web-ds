const mongoose = require('mongoose');

class MongoConnection {
    constructor({ user, password, address, nameDB }) {
        if (MongoConnection.instance) {
            return MongoConnection.instance;
        }

        this.user = user;
        this.password = password;
        this.address = address;
        this.nameDB = nameDB;
        this.uri = `mongodb+srv://${user}:${password}@${address}/${nameDB}`;

        this.connect();
        MongoConnection.instance = this;
    }

    async connect() {
        try {
            await mongoose.connect(this.uri, { useNewUrlParser: true });
            console.log('Conexion exitosa');
        } catch (error) {
            console.error('Error en la conexion a DB', error);
        }
    }
}

module.exports = MongoConnection;