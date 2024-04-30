// model
const mongoose = require('mongoose'); // importación de la biblioteca  mongoose
const Schema = mongoose.Schema; //creación de una instancia de un esquema de Mongoose
const ObjectId = Schema.Types.ObjectId
const { appConfig } = require('../config')

const ProfessorScheme = new Schema({
    username: String, 
    firstName: String,
    secondName: String,
    firstSurname: String,
    secondSurname: String,
    email: String, 
    campus: String,
    password: String,
    cellPhone: String,
    officePhone: String,
    photo: String, 
    isCordinator: Boolean,
    createdBy: String,
    lastModifiedBy: String        
},
{ collection: 'professor', timestamps: true });

ProfessorScheme.methods.setPhoto = function setPhoto (photo){
    const { host, port } = appConfig
    this.photo = `${host}:${port}/public/${photo}`
}

const Professor = mongoose.model('Professor', ProfessorScheme);
module.exports = Professor; 