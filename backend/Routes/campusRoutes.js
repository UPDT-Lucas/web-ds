const express = require('express');
const {registerCampus, getAllCampus, getCampus} = require('../Controllers/campusController')
const router = express.Router();


router.post('/register-campus',  registerCampus);
router.get('/all-campus', getAllCampus);
router.get('/getCampus/:id', getCampus);


module.exports = router;