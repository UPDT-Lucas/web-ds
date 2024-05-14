const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

// Permitir conexión a la base de datos
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

const professorRoutes = require('./Routes/professorRoutes');
app.use('/', professorRoutes);

const studentRoutes = require('./Routes/studentRoutes');
app.use('/', studentRoutes);

const campusRoutes = require('./Routes/campusRoutes');
app.use('/', campusRoutes);

const activityRoutes = require('./Routes/activityRoutes');
app.use('/', activityRoutes);


const assistantRoutes = require('./Routes/assistantRoutes');
app.use('/', assistantRoutes);


/*const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});*/


module.exports = app; 