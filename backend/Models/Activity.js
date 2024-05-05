const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivityScheme = new Schema({
    typeOfActivity: String,
    nameActivity: String, 
    responsible: String
},
{collection: 'activities', timestamps: true});