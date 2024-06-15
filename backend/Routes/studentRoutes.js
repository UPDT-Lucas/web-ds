const express = require('express');
const {registerStudent, getAllStudent, getStudent, deleteStudent, 
    getStudentsByCampus, editAccountStudent, getStudentByName,
    forgotPasswordS, verifyOtp, resetPassword} = require('../Controllers/StudentController');
const router = express.Router();


router.post('/register-student',  registerStudent);
router.get('/all-student', getAllStudent);
router.get('/getStudent/:id', getStudent);
router.get('/getStudentByName', getStudentByName);
router.get('/getStudentByCampus/:ids', getStudentsByCampus);
// router.get('/filterByCampus', filterByCampus)
router.delete('/delete-student/:id', deleteStudent);
router.put('/editAccountStudent/:id', editAccountStudent);


//router.post('/forgot-password-student', forgotPasswordS);
//router.post('/verify-otp-student/:id', verifyOtp);
//router.post('/reset-password-student/:id', resetPassword);

module.exports = router;
