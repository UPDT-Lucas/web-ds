const express = require('express');
const {registerProfessor, getAllProfessor, getProfessor, editAccount, login, deleteProfessor, getProfessorByCampus, forgotPassword, verifyOtp, resetPassword, getProfessorsByName, getProfessorsByEmail} = require('../Controllers/professorController');

const router = express.Router();


// Rutas para el registro y consulta de profesores
router.post('/register-professor', registerProfessor);
router.get('/all-professor', getAllProfessor);
router.get('/getProfessor/:id', getProfessor);
router.get('/getProfessorByName', getProfessorsByName);
router.put('/editAccount/:id', editAccount);
router.post('/login', login);
router.delete('/delete-professor/:id', deleteProfessor);
router.get('/getProfessorByCampus/:id', getProfessorByCampus);
router.get('/getProfessorByEmail/:inputEmail', getProfessorsByEmail);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp/:id', verifyOtp);
router.post('/reset-password/:id', resetPassword);


module.exports = router;


