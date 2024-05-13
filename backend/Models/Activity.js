const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivityScheme = new Schema({
    typeOfActivity: String,            //Orientadora, Motivacional, De apoyo a la vida estudiantil
                                       // De orden técnico, De recración
    nameActivity: String,               
    responsibles: [{                //Profesores responsables de la actividad
        type: Schema.Types.ObjectId,
        ref: 'Professor'
    }], 
    executionDate: Date,        //Fecha exacta de realización
    executionWeek: Number,      //Numero de semana de realización
    announcementDate: Date,    //Fecha de anuncio a la comunidad estudiantil
    reminderDates: [Date],    //Fechas de recordatorios
    isRemote: Boolean,
    virtualActivityLink: String,  
    activityPoster: String,   //Afiche jpg o pdf
    currentState: String,   //Planeada, notificada, realizada, cancelada

},
{collection: 'activities', timestamps: true});

const Activity = mongoose.model('Activity', ActivityScheme);
module.exports = Activity;
