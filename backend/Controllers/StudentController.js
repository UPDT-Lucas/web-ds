const Student = require('../Models/Student');
const Professor = require('../Models/Professor');
const {validateStudent} = require('../Utils/studentValidator');
const mongoose = require('mongoose');
const { hashPassword , generateOTP, comparePassword} = require('../Utils/authUtils');
const {sendEmail, forgotPasswordTemplate} = require('../Utils/emailUtils');
const JWT = require('jsonwebtoken');

/*
Permite registrar un estudiante en la base de datos
toma 2 parametros, req y res (request y response respectivamente). res sirve tanto como parametro de entrada como valor de retorno
IN:
   + req: contiene la informacion del estudiante a registrar en un objeto JSON llamado body
   + res: contiene la respuesta que se le dara al cliente

OUT:
   + res: en caso de exito al registrar un estudiante retorna un mensaje de exito y un codigo 201 (created)
   x res: en caso de fallo retorna un mensaje de error y un codigo 400 (bad request)
   x res: en caso de fallo del servidor retorna un mensaje de error y un codigo 500 (internal server error)

body debe contener los siguientes campos:
- firstName: primer nombre del estudiante
- secondName: segundo nombre del estudiante (opcional)
- firstSurname: primer apellido del estudiante
- secondSurname: segundo apellido del estudiante (opcional)
- email: correo del estudiante
- cellPhone: numero de telefono del estudiante
*/

const registerStudent = async (req, res) => {
    try {

        
        const result = validateStudent(req.body);

        if (result.error) {
            console.log(result.error.message);
            return res.status(400).json({ error: JSON.parse(result.error.message) }); //code 400: bad request
        }

        const exists = await Student.findOne({ email: result.data.email });
    
        if (exists) {
            return res.status(400).json({ error: 'An account with this email already exists!' }); //code 400: bad request
        }

        const hashed = await hashPassword(result.data.carnet);

        const newStudent = Student({
            firstName: result.data.firstName,
            secondName: result.data.secondName,
            firstSurname: result.data.firstSurname,
            secondSurname: result.data.secondSurname,
            email: result.data.email,
            campus: result.data.campus,
            cellPhone: result.data.cellPhone,
            carnet: hashed,
            security:{
                resetPasswordOTP: undefined,
                emailVerificationToken: verificationToken,
            },
            //rol: result.data.rol,
            isActive: result.data.isActive,
        });


        await Student.create(newStudent);

        return res.status(201).json({ message: 'Student created' }); //code 201: created
    } catch (error) {

        console.error("Error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


// function to return all the student 
/*
Permite consultar todos los estudiantes en la base de datos
toma 2 parametros, req y res (request y response respectivamente). res sirve tanto como
 parametro de entrada como valor de retorno
IN:
    + req: No contiene información relevante en este caso
    + res: contiene la respuesta que se le dará al cliente
OUT:
    + res: en caso de éxito al consultar todos los estudiantes, retorna los estudiantes consultados
     y un codigo 201 (Created)
    x res: en caso de fallo del servidor retorna un mensaje de error y un codigo 500 
    (internal server error)
*/

const getAllStudent = async(req, res) => {
    try{
        const students = await Student.find().limit(req.query.limit).skip(req.query.skip);
        return res.status(200).json({students});
    }catch(error){
        console.log(error);
        return res.status(500).json({error: 'Internal server error'})
    }
}

const getStudentByName = async (req, res) => {
    try {
        const students = await Student.find({ 
            $or: [
                { firstName: { $regex: new RegExp(req.query.name, 'i') } }, // Busca por coincidencia de nombre
            ]
        }).skip(req.query.skip).limit(req.query.limit)
        return res.status(200).json({ students });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/*
Permite consultar un estudiante para obtener su cuenta de la base de datos
toma 2 parametros, req y res (request y response respectivamente). res sirve tanto como
 parametro de entrada como valor de retorno
IN:
    + req: Contiene la información para realizar la consulta del estudante
    + res: contiene la respuesta que se le dará al cliente
OUT:
    + res: en caso de éxito al consultar al estudiante, retorna la info de la cuenta del estudiante
     y un codigo 200 (Ok)
    x res: en caso de fallo retorna un mensaje de error y un codigo 400(bad request)
    x res: en caso de fallo del servidor retorna un mensaje de error y un codigo 500 
    (internal server error)
*/

const getStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id);

        if (!student) {
            return res.status(400).json({ error: 'Student does not exist' });
        }

        // Extraer propiedades del objeto estudiante
        const { firstName, secondName, firstSurname, secondSurname, email, campus, cellPhone, isActive, photo} = student;

        // Construir el objeto de cuenta
        const account = {
            name: { firstName, secondName, firstSurname, secondSurname },
            email,
            campus,
            cellPhone,
            photo,
            //carnet,
            //rol,
            isActive
        };

        return res.status(200).json({ account });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


//elimina un estudiante de la base de datos 

const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID del estudiante de la URL
        //const { password } = req.body;

        // Buscar el estudiante por su ID
        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Eliminar el estudiante de la base de datos
        await Student.findByIdAndDelete(id);

        return res.status(200).json({ message: 'Student deleted' }); // Código 200: OK
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Obtener estudiantes de un campus en específico por medio 
// del id del campus.

const getStudentsByCampus = async (req, res) => {
    try {
        const { ids } = req.params
        // console.log(ids)
        // const { limit, skip } = req.query; // Extraer ids, limit y skip de los parámetros de la consulta

        if (!ids) {
            return res.status(400).json({ error: 'Invalid campus IDs' });
        }

        const idsArray = ids.split(',');

        if (idsArray.length === 0) {
            return res.status(400).json({ error: 'Invalid campus IDs' });
        }

        // Buscar todos los estudiantes que tienen el ID del campus en su campo 'campus'
        const students = await Student.find({ campus: { $in: idsArray } })
        .skip(req.query.skip).limit(req.query.limit)
            // .skip(parseInt(skip) || 0)  // Asegúrate de que skip sea un número
            // .limit(parseInt(limit) || 10); // Asegúrate de que limit sea un número

        if (!students || students.length === 0) {
            return res.status(400).json({ error: 'No students found in these campuses' });
        }

        return res.status(200).json({ students });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};



const editAccountStudent = async (req, res) => {
    try{
        const { id } = req.params;

        let updates = {
            //solo puede editar su numero y fotografia 
            firstName: req.body.firstName,
            secondName: req.body.secondName,
            firstSurname: req.body.firstSurname,
            secondSurname: req.body.secondSurname,
            email: req.body.email,
            campus: req.body.campus,
            cellPhone: req.body.cellPhone,
            photo: req.body.photo,
            isActive: req.body.isActive,
            //rol: req.body.rol,
            //carnet: req.body.carnet,
        }

        const student = await Student.findOneAndUpdate({_id: id}, updates, {new: true})

        if(!student){
            return res.status(400).json({error: 'Student does not exits'});
        }
        return res.status(200).json({message: 'Student update successfully', student: student});
    }catch(error){
        console.log(error);
        return res.status(500).json({error: 'Internal server error'});

    }
}


const addNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const newNotification = req.body.notification;

        // Encuentra el estudiante por ID
        const student = await Professor.findById(id);

        if (!student) {
            return res.status(400).json({ error: 'Student does not exist' });
        }

        // Verifica si la notificación ya existe
        const notificationExists = student.notifications.some(notification =>
            notification.text === newNotification.text 
            // && new Date(notification.date).getTime() === new Date(newNotification.date).getTime()
        );

        if (!notificationExists) {
            // Agrega la nueva notificación al arreglo de notificaciones
            student.notifications.push(newNotification);

            // Guarda los cambios
            await student.save();

            return res.status(200).json({ message: 'Notification added successfully', student: student });
        } 
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const updateNotification = async (req, res) => {
    try {
        const { studentId, notificationId } = req.params;
        const { seen } = req.body;

        // Encuentra al estudiante por ID
        const student = await Professor.findById(studentId);

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Encuentra la notificación por ID
        const notification = student.notifications.find(notification => notification._id == notificationId);

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        // Actualiza el estado de "visto/no visto" de la notificación
        notification.seen = seen;


        // Guarda los cambios en la base de datos
        await student.save();

        return res.status(200).json({ message: 'Notification updated successfully', student: student });
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

const forgotPasswordS = async (req, res) => {
    try {
        const { email } = req.body;
        // check data here. can't trust the FE
        // validate all REQUIRED fields are present
        if (!email) {
            return res.status(400).json({ error: 'Se requiere de un correo electrónico' }); //code 400: bad request
        }
        // check if the student exists
        const student = await Student.findOne({ email: email })
        if (!student) {
            return res.status(404).json({ error: 'No se encontró la dirección de correo electrónico' });
        }
        // generate an otp here
        const otp = generateOTP();

        // update the student's otp
        //const result = await Student.updateOne({ _id: id }, { 'security.resetPasswordOtp': otp });
        student.security.resetPasswordOtp = otp;
        await student.save();


        // generate a token
        const token = JWT.sign({
            id: student._id
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
        return res.status(200).json({ message: `Código enviado a: ${student.email}`, otp: otp, _id: student._id,}); //code 200: OK

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

        // Busca al student por su ID
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }

        // Verifica si el código OTP coincide con la confirmación proporcionada por el usuario
        if (otp !== confirmation) {
            return res.status(401).json({ error: 'El código OTP y la confirmación no coinciden' });
        }

        // Verifica si el código OTP coincide con el generado y enviado al correo electrónico del usuario
        if (otp !== student.security.resetPasswordOtp) {
            return res.status(401).json({ error: 'Código OTP incorrecto' });
        }

        // Aquí puedes verificar si el OTP ha expirado según tus requisitos

        // Elimina el código OTP una vez que se ha verificado correctamente
        student.security.resetPasswordOtp = undefined;
        await student.save();

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
        const { id } = req.params; // Obtén el ID del estudiante de los parámetros de la URL

        // Verifica que se proporcionen tanto la nueva contraseña como la confirmación
        if (!newPassword || !confirmPassword) {
            return res.status(400).json({ error: 'Por favor, llene todos los campos.' }); // Código 400: Solicitud incorrecta
        }

        // Verifica que las contraseñas coincidan
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: 'Las contraseñas no coinciden.' }); // Código 400: Solicitud incorrecta
        }

        // Busca al estudiante por su ID
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ error: 'No se encontró el usuario.' }); // Código 404: No encontrado
        }

        // Hashea la nueva contraseña
        const hashedPassword = await hashPassword(newPassword);

        // Actualiza la contraseña del estudiante
        student.password = hashedPassword;
        await student.save();

        // Responde con un mensaje de éxito
        return res.status(200).json({ message: 'Su contraseña ha sido actualizada correctamente' }); // Código 200: OK

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' }); // Código 500: Error interno del servidor
    }
}


const sendVerificationEmail = (email, verificationToken) => {
    try {
       //const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;
        const subject = 'Verify your Project email';
        //const text = `Click on this link to verify your email: ${verificationLink}`;
        //const template = verificationLinkTemplate(verificationLink);
        sendEmail(email, subject, text);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { registerStudent, getAllStudent, getStudent, deleteStudent,
    getStudentsByCampus, editAccountStudent, getStudentByName, addNotification, 
    updateNotification, forgotPasswordS, verifyOtp, resetPassword, sendVerificationEmail }