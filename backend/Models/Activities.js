// model
const mongoose = require('mongoose'); // importación de la biblioteca  mongoose
const Schema = mongoose.Schema; //creación de una instancia de un esquema de Mongoose
const ObjectId = Schema.Types.ObjectId
const { appConfig } = require('../config')

const ActivitiesScheme = new Schema({
   
    startWeekActivity: { type: Date },
    endWeekActivity: { type: Date },

    typeOfActivity: String,
    nameActivity: String, 



    responsible: String, 

    startDateActivity: { type: Date },
    endDateActivity: { type: Date },
     



    createdBy: String,
    lastModifiedBy: String        
},
{ collection: 'activity', timestamps: true });

ActivitiesScheme.methods.setPhoto = function setPhoto (photo){
    const { host, port } = appConfig
    this.photo = `${host}:${port}/public/${photo}`
}

const Activities = mongoose.model('Activities', ActivitiesScheme);
module.exports = Activities; 