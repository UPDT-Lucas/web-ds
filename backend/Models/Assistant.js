// model
const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 
const ObjectId = Schema.Types.ObjectId
const { appConfig } = require('../config')

const AssistanceScheme = new Schema({

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
    cellPhone: String,
    officePhone: String,
    photo: String, 
    createdBy: String,
    lastModifiedBy: String        
},
{ collection: 'assistant', timestamps: true });


AssistanceScheme.methods.setPasswordOtp = function setPasswordOtp(otp){
    this.security.resetPasswordOTP = otp;
}

const Assistant = mongoose.model('Assistant', AssistanceScheme);
module.exports = Assistant; 