const nodemailer = require('nodemailer');

// plantilla para dar formato al correo
// IN : link de verificacion
// OUT: plantilla de correo con el link de verificacion
/*
const verificationLinkTemplate = (link) => {
    return `
        <h1>Verify your email</h1>
        <p>Click the link below to verify your email</p>
        <a href="${link}">Verify Email</a>
    `
}*/



// plantilla para dar formato al correo
// IN : codigo de verificacion
// OUT: plantilla de correo con el codigo de verificacion
const forgotPasswordTemplate = (code) => {
    return `
        <h1>Reset your password</h1>
        <p>This code is only valid for 15 minutes.</p>
        <h2>${code}</h2>
    `
}

/*
Funcion para enviar correos electronicos.
Utiliza nodemailer para enviar correos electronicos.
*/

const sendEmail = async (email, subject, text, template='') => {
    try {

        const mailConfig = {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPASSWORD
            }
        }

        const transporter = nodemailer.createTransport(mailConfig);
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            text: text,
            html: template
        };

        try{
            await transporter.sendMail(mailOptions);
        }catch(error){
            console.log(error);
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports = {sendEmail, forgotPasswordTemplate};