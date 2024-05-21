const express = require('express');
const { registerActivity, getAllActivities, getActivity,
     editActivity, insertCommentActivity, deleteActivity } = require('../Controllers/activitiesController');

const router = express.Router();

//Rutas para el registro y consulta de actividades
router.post('/register-activity', registerActivity);
router.get('/all-activities', getAllActivities);
router.get('/getActivity/:id', getActivity);
router.put('/editActivity/:id', editActivity);
router.put('/insert-comment-activity/:id', insertCommentActivity);
router.delete('/delete-activity/:id', deleteActivity);

module.exports = router;