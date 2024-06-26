const express = require('express');
const {registerStudent, getAllStudent, getStudent, deleteStudent, 
    getStudentsByCampus, editAccountStudent, getStudentByName, addNotification,
    updateNotification} = require('../Controllers/StudentController');

const router = express.Router();

router.post('/register-student',  registerStudent);
router.get('/all-student', getAllStudent);
router.get('/getStudent/:id', getStudent);
router.get('/getStudentByName', getStudentByName);
router.get('/getStudentByCampus/:ids', getStudentsByCampus);
// router.get('/filterByCampus', filterByCampus)
router.delete('/delete-student/:id', deleteStudent);
router.put('/editAccountStudent/:id', editAccountStudent);
router.put('/addNotification/:id', addNotification);
router.put('/updateNotification/:id', updateNotification);

//router.post('/forgot-password-student', forgotPasswordS);
//router.post('/verify-otp-studenat/:id', verifyOtp);
//router.post('/reset-password-student/:id', resetPassword);

module.exports = router;
