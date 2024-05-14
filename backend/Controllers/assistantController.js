const Assistant = require('../Models/Assistant');
const Campus = require('../Models/Campus');
const mongoose = require('mongoose');
const crypto = require('crypto');
const JWT = require('jsonwebtoken');
const { hashPassword, comparePassword, generateOTP, checkToken } = require('../Utils/authUtils');
const {sendEmail, forgotPasswordTemplate} = require('../Utils/emailUtils')


const registerAssistant = async (req, res) => {
    try {
        //const result = req.body;

        const exists = await Assistant.findOne({
            email: req.body.email,
        })

        if (exists) {
            return res.status(400).json({ error: 'An account with this email already exists!' }); //code 400: bad request
        }

        const hashed = await hashPassword(req.body.password);
        const verificationToken = crypto.randomBytes(20).toString('hex');


       const campus = await Campus.findById(req.body.campus);
       //const campus = await Campus.findById( id );

      if(!campus){
            return res.status(400).json({error: 'Campus not found'});
        }

        let campusCode = '';
        switch (campus._id.toString()) {
            case '663057633ee524ad51bd5b05':
                campusCode = 'CA'; // Cartago
                break;
            case '6630576f3ee524ad51bd5b09':
                campusCode = 'AL'; // Alajuela
                break;
            case '663057763ee524ad51bd5b0c':
                campusCode = 'SC'; // San Carlos
                break;
            case '663057863ee524ad51bd5b0f':
                campusCode = 'SJ'; // San Jose
                break;
            case '6630578f3ee524ad51bd5b12':
                campusCode = 'LI'; // Limon
                break;
            default:
                campusCode = 'OT'; 
        }

        //Contador de asistentes
       const count = await Assistant.countDocuments({ campus: campus._id });

       const assistantCode = `${campusCode}-${count.toString().padStart(2, '0')}`;


        const newAssistant = Assistant({
            firstName: req.body.firstName,
            secondName: req.body.secondName,
            firstSurname: req.body.firstSurname,
            secondSurname: req.body.secondSurname,
            email: req.body.email,
            code: assistantCode,
            campus: req.body.campus,
            password: hashed,
            security:{
                resetPasswordOTP: undefined,
                emailVerificationToken: verificationToken,
            },
            
            cellPhone: req.body.cellPhone,
            officePhone: req.body.officePhone,
            photo: req.body.photo
            
        });

        await Assistant.create(newAssistant);
        sendVerificationEmail(req.body.email, verificationToken);

        return res.status(201).json({ message: 'Assistant created' }); //code 201: created
    } catch (error) {

        console.error("Error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


//-------------------------------------------------------------------

const getAllAssistant = async(req, res) => {
    try{
        const assistant = await Assistant.find().limit(req.query.limit).skip(req.query.skip);
        return res.status(200).json({assistant});
    }catch(error){
        console.log(error);
        return res.status(500).json({error: 'Internal server error'})
    }
}

//-------------------------------------------------------------------

const getAssistant = async (req, res) => {
    try {
        const { id } = req.params;
        const assistant = await Assistant.findById(id);

        if (!assistant) {
            return res.status(400).json({ error: 'Assistant does not exist' });
        }

        return res.status(200).json({ assistant });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


//-------------------------------------------------------------------
const getAssitantByCampus = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar todos los assitant que tienen el ID del campus en su campo 'campus'
        const assitant = await Assistant.find({ campus: id });

        if (!assitant || assitant.length === 0) {
            return res.status(404).json({ error: 'No assitant found in this campus' });
        }

        return res.status(200).json({ assitant });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


//-------------------------------------------------------------------

const sendVerificationEmail = (email, verificationToken) => {
    try {
        const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;
        const subject = 'Verify your Project email';
        const text = `Click on this link to verify your email: ${verificationLink}`;
        //const template = verificationLinkTemplate(verificationLink);
        sendEmail(email, subject, text, template);
    } catch (error) {
        console.log(error);
    }
}


module.exports = {registerAssistant, getAllAssistant, getAssistant, sendVerificationEmail,
    getAssitantByCampus
}