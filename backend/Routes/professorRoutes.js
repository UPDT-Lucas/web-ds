const express = require('express');
const { uploadPhoto } = require('../Utils/storage')
const {registerProfessor, getAllProfessor, getProfessor, editAccount, login, deleteProfessor, getProfessorByCampus} = require('../Controllers/professorController');

const router = express.Router();


// Rutas para el registro y consulta de profesores
router.post('/register-professor', uploadPhoto('professor'), registerProfessor);
router.post('/login', login);
router.get('/all-professor', getAllProfessor);
router.get('/getProfessor/:id', getProfessor);
router.put('/editAccount/:id', editAccount);
router.delete('/delete-professor/:id', deleteProfessor);
router.get('/getProfessorByCampus/:id', getProfessorByCampus);


module.exports = router;


