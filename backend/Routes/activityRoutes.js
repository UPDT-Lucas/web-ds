const express = require('express');
const { registerActivity, getAllActivities, getActivity,
     editActivity, deleteActivity } = require('../Controllers/activitiesController');

const router = express.Router();

//Rutas para el registro y consulta de actividades
router.post('/register-activity', registerActivity);
router.get('/all-activities', getAllActivities);
router.get('/getActivity/:id', getActivity);
router.put('/editActivity/:id', editActivity);
router.delete('/delete-activity/:id', deleteActivity);

module.exports = router;