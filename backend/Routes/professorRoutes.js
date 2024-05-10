const express = require('express');
const { uploadPhoto } = require('../Utils/storage')
const {registerProfessor, getAllProfessor, getProfessor, editAccount, login, deleteProfessor, getProfessorByCampus, forgotPassword, verifyOtp, resetPassword} = require('../Controllers/professorController');

const router = express.Router();


// Rutas para el registro y consulta de profesores
router.post('/register-professor', uploadPhoto('professor'), registerProfessor);
router.get('/all-professor', getAllProfessor);
router.get('/getProfessor/:id', getProfessor);
router.put('/editAccount/:id', editAccount);
router.post('/login', login);
router.delete('/delete-professor/:id', deleteProfessor);
router.get('/getProfessorByCampus/:id', getProfessorByCampus);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp/:id', verifyOtp);
router.post('/reset-password/:id', resetPassword);


module.exports = router;


