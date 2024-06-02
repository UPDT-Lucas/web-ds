const Professor = require('../Models/Professor');
const Assistant = require('../Models/Assistant');
const Student = require('../Models/Student');
const {validateProfessor} = require('../Utils/professorValidator');
const mongoose = require('mongoose');
const crypto = require('crypto');
const Campus = require('../Models/Campus');
const JWT = require('jsonwebtoken');
const { hashPassword, comparePassword, generateOTP, checkToken } = require('../Utils/authUtils');
const {sendEmail, forgotPasswordTemplate} = require('../Utils/emailUtils')


/*
Permite registrar un profesor en la base de datos
toma 2 parametros, req y res (request y response respectivamente). res sirve tanto como parametro de entrada como valor de retorno
IN:
   + req: contiene la informacion del profesor a registrar en un objeto JSON llamado body
   + res: contiene la respuesta que se le dara al cliente

OUT:
   + res: en caso de exito al registrar un profesor retorna un mensaje de exito y un codigo 201 (created)
   x res: en caso de fallo retorna un mensaje de error y un codigo 400 (bad request)
   x res: en caso de fallo del servidor retorna un mensaje de error y un codigo 500 (internal server error)

body debe contener los siguientes campos:
- username: nombre de usuario del profesor
- firstName: primer nombre del profesor
- secondName: segundo nombre del profesor (opcional)
- firstSurname: primer apellido del profesor
- secondSurname: segundo apellido del profesor (opcional)
- email: correo del profesor
- cellPhone: numero de telefono del profesor
- officePhone: numero de telefono - ofocina del profesor
- isCordinator: booleano que indica si el profesor es cordinador o no 
- photo: foto del profesor
*/

const registerProfessor = async (req, res) => {
    try {

        req.body.isCordinator = (req.body.isCordinator === 'true')
        const result = validateProfessor(req.body);

        if (result.error) {
            console.log(result.error.message);
            return res.status(400).json({ error: JSON.parse(result.error.message) }); //code 400: bad request
        }

        const file = req.file;
        const exists = await Professor.findOne({ email: result.data.email });
    
        if (exists) {
            return res.status(400).json({ error: 'An account with email already exists!' }); //code 400: bad request
        }

        const hashed = await hashPassword(result.data.password);
        const verificationToken = crypto.randomBytes(20).toString('hex');


        const campus = await Campus.findById(result.data.campus);

        if (!campus) {
            return res.status(400).json({ error: 'Campus not found' });
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
                campusCode = 'SJ'; // San José
                break;
            case '6630578f3ee524ad51bd5b12':
                campusCode = 'LI'; // Limón
                break;
            default:
                campusCode = 'OT'; 
        }

        const count = await Professor.countDocuments({ campus: campus._id });

        const professorCode = `${campusCode}-${count.toString().padStart(2, '0')}`;


        const newProfessor = Professor({
            //username: result.data.username,
            firstName: result.data.firstName,
            secondName: result.data.secondName,
            firstSurname: result.data.firstSurname,
            secondSurname: result.data.secondSurname,
            email: result.data.email,
            code: professorCode,
            campus: result.data.campus,
            password: hashed,
            security:{
                resetPasswordOTP: undefined,
                emailVerificationToken: verificationToken,
            },
            cellPhone: result.data.cellPhone,
            officePhone: result.data.officePhone,
            isCordinator: result.data.isCordinator,  
        });
        await Professor.create(newProfessor);

        sendVerificationEmail(result.data.email, verificationToken);

        return res.status(201).json({ message: 'Professor created' }); //code 201: created
    } catch (error) {

        console.error("Error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}



// function to return all the professor 
/*
Permite consultar todos los profesores en la base de datos
toma 2 parametros, req y res (request y response respectivamente). res sirve tanto como
 parametro de entrada como valor de retorno
IN:
    + req: No contiene información relevante en este caso
    + res: contiene la respuesta que se le dará al cliente
OUT:
    + res: en caso de éxito al consultar todos los profesores, retorna los profesores consultados
     y un codigo 201 (Created)
    x res: en caso de fallo del servidor retorna un mensaje de error y un codigo 500 
    (internal server error)
*/

const getAllProfessor = async(req, res) => {
    try{
        const professors = await Professor.find().limit(req.query.limit).skip(req.query.skip);
        return res.status(200).json({professors});
    }catch(error){
        console.log(error);
        return res.status(500).json({error: 'Internal server error'})
    }
}


/*
Permite consultar un profesor para obtener su cuenta de la base de datos
toma 2 parametros, req y res (request y response respectivamente). res sirve tanto como
 parametro de entrada como valor de retorno
IN:
    + req: Contiene la información para realizar la consulta del profesor
    + res: contiene la respuesta que se le dará al cliente
OUT:
    + res: en caso de éxito al consultar al profesor, retorna la info de la cuenta del profesor
     y un codigo 200 (Ok)
    x res: en caso de fallo retorna un mensaje de error y un codigo 400(bad request)
    x res: en caso de fallo del servidor retorna un mensaje de error y un codigo 500 
    (internal server error)
*/


const getProfessor = async (req, res) => {
    try {
        const { id } = req.params;
        const professor = await Professor.findById(id);

        if (!professor) {
            return res.status(400).json({ error: 'Professor does not exist' });
        }

        // Extraer propiedades del objeto professor
        const { firstName, secondName, firstSurname, secondSurname, email, campus, cellPhone, officePhone, photo, isCordinator, code } = professor;

        //const campusName = campus ? campus.campusName : null;
        
        // Construir el objeto de cuenta
        const account = {
            name: { firstName, secondName, firstSurname, secondSurname },
            email,
            campus,
            cellPhone,
            officePhone,
            isCordinator,
            photo,
            code
        };

        return res.status(200).json({ account });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


// function to edit the account of a professor, comes from a PUT request
const editAccount = async (req, res) => {
    try{
        const { id } = req.params;
        //const { file } = req;

        let updates = {
            //username: req.body.username,
            firstName: req.body.firstName,
            secondName: req.body.secondName,
            firstSurname: req.body.firstSurname,
            secondSurname: req.body.secondSurname,
            email: req.body.email,
            campus: req.body.campus,
            photo: req.body.photo,
            //password: hashed,
            cellPhone: req.body.cellPhone,
            officePhone: req.body.officePhone,
            isCordinator: req.body.isCordinator
            
        }


        //check if the user exists
        const professor = await Professor.findOneAndUpdate({_id: id}, updates, {new: true})

        if(!professor){
            return res.status(400).json({error: 'Professor does not exits'});
        }
        return res.status(200).json({message: 'Professor update successfully', professor: professor});
    }catch(error){
        console.log(error);
        return res.status(500).json({error: 'Internal server error'});

    }

}


const getProfessorsByName = async (req, res) => {
    try {
        const professors = await Professor.find({ 
            $or: [
                { firstName: { $regex: new RegExp(req.query.name, 'i') } }, // Busca por coincidencia de nombre
            ]
        }).skip(req.query.skip).limit(req.query.limit)
        return res.status(200).json({ professors });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Nota para futuras implementaciones:
// En el return res.status(200).json({ professors }); debería de ser return res.status(200).json(professors);
// En esta funcion esta corregido pero en otras todavia se
// hace un .json({variable}) en lugar de .json(variable)
// El resultado es parecido pero el contenido es un poco más limpio en el frontend
const getProfessorsByEmail = async (req, res) => {
    try {
        const { inputEmail } = req.params;
        const professor = await Professor.findOne({ inputEmail });

        if (!professor) {
            return res.status(400).json({ error: 'Professor does not exist' });
        }

        // Extraer propiedades del objeto professor
        const { _id, firstName, secondName, firstSurname, secondSurname, email, campus, cellPhone, officePhone, photo, code,  isCordinator } = professor;

        //const campusName = campus ? campus.campusName : null;
        
        // Construir el objeto de cuenta
        const account = {
            name: { firstName, secondName, firstSurname, secondSurname },
            email,
            campus,
            cellPhone,
            officePhone,
            isCordinator,
            photo,
            code,
            _id
        };

        return res.status(200).json({ account });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
/*
Permite loguear a un profesor en la base de datos
toma 2 parametros, req y res (request y response respectivamente). res sirve tanto como parametro de entrada como valor de retorno
IN:
    + req: contiene la informacion del profesor a loguear en un objeto JSON llamado body
    + res: contiene la respuesta que se le dara al cliente
OUT:
    + res: en caso de exito al loguear un profesor retorna un objeto con la informacion relevante* del usuario,
           una cookie con un token se sesion y un codigo 200 (OK)
    x res: en caso de fallo retorna un mensaje de error y un codigo 400 (bad request)
    x res: en caso de fallo retorna un mensaje de error y un codigo 401 (Unauthorized)
    x res: en caso de fallo del servidor retorna un mensaje de error y un codigo 500 (internal server error)

body debe contener los siguientes campos:
- username: nombre de usuario del profesor
- password: contraseña del profesor
*/


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verifica que se proporcionen tanto el email como la contraseña
        if (!email || !password) {
            return res.status(400).json({ error: 'Please enter both email and password' });
        }

        // Busca en la base de datos un usuario que coincida con el email proporcionado
        const professor = await Professor.findOne({ email });
        let user, actualPassword;

        if (!professor) {
            const assistant = await Assistant.findOne({ email });
            if (!assistant) {
                // Si no es ni profesor ni asistente, busca un estudiante que coincida con el email proporcionado
                user = await Student.findOne({ email });
                if (!user) {
                    return res.status(200).json({ error: 'Usuario no encontrado' });
                }
                actualPassword = user.carnet;
            } else {
                user = assistant;
                actualPassword = assistant.password;
            }
        } else {
            user = professor;
            actualPassword = professor.password;
        }

        // Compara la contraseña proporcionada con la contraseña almacenada en la base de datos
        const Match = await comparePassword(password, actualPassword);

        // Verifica si la contraseña proporcionada coincide con la contraseña almacenada o con el carnet (en caso de ser estudiante)
        if (!Match && password !== actualPassword) {
            return res.status(200).json({ error: 'Incorrect password' });
        }

        return res.status(200).json({
            message: 'Login successful',
            _id: user.id,
            isTeacher: !user.hasOwnProperty('carnet') // Determina si el usuario es profesor o asistente
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};



//elimina un profesor de la base de datos 

const deleteProfessor = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID del profesor de la URL
        //const { password } = req.body;

        // Buscar el profesor por su ID
        const professor = await Professor.findById(id);

        if (!professor) {
            return res.status(404).json({ error: 'Professor not found' });
        }

        // Eliminar el profesor de la base de datos
        await Professor.findByIdAndDelete(id);

        return res.status(200).json({ message: 'Professor deleted' }); // Código 200: OK
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


// Obtener profesores de un campus en específico por medio 
// del id del campus.

const getProfessorByCampus = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar todos los profesores que tienen el ID del campus en su campo 'campus'
        const professor = await Professor.find({ campus: id })
        .skip(req.query.skip)
        .limit(req.query.limit);

        if (!professor || professor.length === 0) {
            return res.status(404).json({ error: 'No professor found in this campus' });
        }

        return res.status(200).json({ professor });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/* 
Permite enviar un correo electronico a un usuario para que pueda recuperar su contraseña
toma 2 parametros, req y res (request y response respectivamente). res sirve tanto como 
parametro de entrada como valor de retorno
*/

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        // check data here. can't trust the FE
        // validate all REQUIRED fields are present
        if (!email) {
            return res.status(400).json({ error: 'Se requiere de un correo electrónico' }); //code 400: bad request
        }
        // check if the professor exists
        const professor = await Professor.findOne({ email: email })
        if (!professor) {
            return res.status(404).json({ error: 'No se encontró la dirección de correo electrónico' });
        }
        // generate an otp here
        const otp = generateOTP();

        // update the professor's otp
        //const result = await Professor.updateOne({ _id: id }, { 'security.resetPasswordOtp': otp });
        professor.security.resetPasswordOtp = otp;
        await professor.save();


        // generate a token
        const token = JWT.sign({
            id: professor._id
        },
            process.env.ACCESS_TOKEN_SEQUENCE,
            { expiresIn: '15m' }
        );

        const subject = 'Reset password';
        const template = forgotPasswordTemplate(otp);
        sendEmail(email, subject, " ", template);

        res.cookie("resetToken", token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 15
        }  
        );
        return res.status(200).json({ message: `Código enviado a: ${professor.email}`, otp: otp, _id: professor._id,}); //code 200: OK

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


/*
Verifica que el OTP (One-time password) enviado por el usuario sea el correcto
toma 2 parametros, req y res (request y response respectivamente). res sirve tanto como parametro de entrada como valor de retorno
*/
const verifyOtp = async (req, res) => {
    try {
        const { id } = req.params;
        const { otp, confirmation } = req.body;

        // Verifica si se proporcionó el código OTP y la confirmación
        if (!otp || !confirmation) {
            return res.status(400).json({ error: 'Se requieren el código OTP y la confirmación' });
        }

        // Busca al profesor por su ID
        const professor = await Professor.findById(id);
        if (!professor) {
            return res.status(404).json({ error: 'Profesor no encontrado' });
        }

        // Verifica si el código OTP coincide con la confirmación proporcionada por el usuario
        if (otp !== confirmation) {
            return res.status(401).json({ error: 'El código OTP y la confirmación no coinciden' });
        }

        // Verifica si el código OTP coincide con el generado y enviado al correo electrónico del usuario
        if (otp !== professor.security.resetPasswordOtp) {
            return res.status(401).json({ error: 'Código OTP incorrecto' });
        }

        // Aquí puedes verificar si el OTP ha expirado según tus requisitos

        // Elimina el código OTP una vez que se ha verificado correctamente
        professor.security.resetPasswordOtp = undefined;
        await professor.save();

        // Responde con un mensaje de éxito
        return res.status(200).json({ message: 'Código OTP y confirmación verificados con éxito' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}






/*  
Permite reiniciar la contraseña de un usuario
toma 2 parametros, req y res (request y response respectivamente). res sirve tanto como parametro de entrada como valor de retorno
*/

const resetPassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        const { id } = req.params; // Obtén el ID del profesor de los parámetros de la URL

        // Verifica que se proporcionen tanto la nueva contraseña como la confirmación
        if (!newPassword || !confirmPassword) {
            return res.status(400).json({ error: 'Por favor, llene todos los campos.' }); // Código 400: Solicitud incorrecta
        }

        // Verifica que las contraseñas coincidan
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: 'Las contraseñas no coinciden.' }); // Código 400: Solicitud incorrecta
        }

        // Busca al profesor por su ID
        const professor = await Professor.findById(id);
        if (!professor) {
            return res.status(404).json({ error: 'No se encontró el usuario.' }); // Código 404: No encontrado
        }

        // Hashea la nueva contraseña
        const hashedPassword = await hashPassword(newPassword);

        // Actualiza la contraseña del profesor
        professor.password = hashedPassword;
        await professor.save();

        // Responde con un mensaje de éxito
        return res.status(200).json({ message: 'Su contraseña ha sido actualizada correctamente' }); // Código 200: OK

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' }); // Código 500: Error interno del servidor
    }
}


/*
Utilidad que crea un metodo de abstracion para enviar correos electronicos
Funciona como una plantilla
*/

const sendVerificationEmail = (email, verificationToken) => {
    try {
       //const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;
        const subject = 'Verify your Project email';
        const text = `Click on this link to verify your email: ${verificationLink}`;
        //const template = verificationLinkTemplate(verificationLink);
        sendEmail(email, subject, text);
    } catch (error) {
        console.log(error);
    }
}



module.exports = {registerProfessor, getAllProfessor, getProfessor, getProfessorsByEmail,
    editAccount, login, deleteProfessor, getProfessorByCampus, getProfessorsByName,
    forgotPassword, verifyOtp, resetPassword, sendVerificationEmail}