const express = require('express');
const { registerAssistant, getAllAssistant, getAssistant, getAssitantByCampus } = require('../Controllers/assistantController');

const router = express.Router();


router.post('/register-assistant', registerAssistant);
router.get('/all-assistant', getAllAssistant);
router.get('/getAssistant/:id', getAssistant);
router.get('/getAssitantByCampus/:id', getAssitantByCampus);


module.exports = router;