const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampusSchema = new Schema({
    campusName: String
},
{ collection: 'campus', timestamps: true });

const Campus = mongoose.model('Campus', CampusSchema);
module.exports = Campus;
