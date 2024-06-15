// model
const mongoose = require('mongoose'); // importación de la biblioteca  mongoose
const Schema = mongoose.Schema; //creación de una instancia de un esquema de Mongoose
const ObjectId = Schema.Types.ObjectId
const { appConfig } = require('../config')

const ProfessorScheme = new Schema({
    //username: String, 
    firstName: String,
    secondName: String,
    firstSurname: String,
    secondSurname: String,
    email: String, 
    code: String,
    campus: {
        type: Schema.Types.ObjectId,
        ref: 'Campus'
    },
    password: String,
    security:{
        resetPasswordOtp: String,
        emailVerificationToken: String,
    },
    notifications: [{           
        text: String,
        date: Date,
        seen: Boolean
    }], // <- Quitar, dejar solo en estudiantes (para pruebas)
    cellPhone: String,
    officePhone: String,
    photo: String, 
    isCordinator: Boolean,
    createdBy: String,
    lastModifiedBy: String        
},
{ collection: 'professor', timestamps: true });


ProfessorScheme.methods.setPasswordOtp = function setPasswordOtp(otp){
    this.security.resetPasswordOTP = otp;
}

const Professor = mongoose.model('Professor', ProfessorScheme);
module.exports = Professor; 