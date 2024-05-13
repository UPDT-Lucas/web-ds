const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivityScheme = new Schema({
    typeOfActivity: String,            //Orientadora, Motivacional, De apoyo a la vida estudiantil
                                       // De orden técnico, De recración
    activityName: String,               
    responsibles: [{                //Profesores responsables de la actividad
        type: Schema.Types.ObjectId,
        ref: 'Professor'
    }], 
    executionDate: Date,        //Fecha exacta de realización
    executionWeek: Number,      //Numero de semana de realización
    announcementDate: Date,    //Fecha de anuncio a la comunidad estudiantil ISO FORMAT
    reminderDates: [Date],    //Fechas de recordatorios
    comments: [{                //Commentarios de los profesores
        text: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: 'Professor'
        },
        replies: [{
            text: String,
            author: {
                type: Schema.Types.ObjectId,
                ref: 'Professor'
            }
        }]
    }],
    isRemote: Boolean,
    virtualActivityLink: String,  
    activityPoster: String,   //Afiche jpg o pdf
    currentState: String,   //Planeada, notificada, realizada, cancelada
},
{collection: 'activities', timestamps: true});

const Activity = mongoose.model('Activity', ActivityScheme);
module.exports = Activity;
