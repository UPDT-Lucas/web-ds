const mongoose = require('mongoose');
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
    cellPhone: String,
    carnet: String, 
    createdBy: String,
    lastModifiedBy: String        
}, { collection: 'student', timestamps: true });

const Student = mongoose.model('Student', StudentScheme);
module.exports = Student;
