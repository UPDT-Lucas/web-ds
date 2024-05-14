const express = require('express');
const {registerStudent, getAllStudent, getStudent, deleteStudent, 
    getStudentsByCampus, editAccountStudent} = require('../Controllers/StudentController');
const router = express.Router();


router.post('/register-student',  registerStudent);
router.get('/all-student', getAllStudent);
router.get('/getStudent/:id', getStudent);
router.get('/getStudentByCampus/:id', getStudentsByCampus);
router.delete('/delete-student/:id', deleteStudent);
router.put('/editAccountStudent/:id', editAccountStudent);


module.exports = router;
