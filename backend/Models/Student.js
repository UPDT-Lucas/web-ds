const mongoose = require('mongoose');
const { boolean } = require('zod');
const Schema = mongoose.Schema;

const StudentScheme = new Schema({
    firstName: String,
    secondName: String,
    firstSurname: String,
    secondSurname: String,
    email: String, 
    campus: {
        type: Schema.Types.ObjectId,
        ref: 'Campus'
    },
    notifications: [{           
        text: String,
        date: Date,
        seen: Boolean,
        activityId: {
            type: Schema.Types.ObjectId,
            ref: 'Activity'
        }
    }],
    cellPhone: String,
    photo: String,
    password: String, //this is carnet
    security:{
        resetPasswordOtp: String,
        emailVerificationToken: String,
    },
    //rol: String,
    isActive: Boolean,
    createdBy: String,
    lastModifiedBy: String        
}, { collection: 'student', timestamps: true });

StudentScheme.methods.setPasswordOtp = function setPasswordOtp(otp){
    this.security.resetPasswordOTP = otp;
}

const Student = mongoose.model('Student', StudentScheme);
module.exports = Student;
