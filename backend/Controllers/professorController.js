const Professor = require('../Models/Professor');
const {validateProfessor} = require('../Utils/professorValidator');
const mongoose = require('mongoose');
const crypto = require('crypto');
const { hashPassword, comparePassword } = require('../Utils/authUtils');


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
            return res.status(400).json({ error: 'An account with this username or email already exists!' }); //code 400: bad request
        }

        const hashed = await hashPassword(result.data.password);

        const newProfessor = Professor({
            username: result.data.username,
            firstName: result.data.firstName,
            secondName: result.data.secondName,
            firstSurname: result.data.firstSurname,
            secondSurname: result.data.secondSurname,
            email: result.data.email,
            campus: result.data.campus,
            password: hashed,
            cellPhone: result.data.cellPhone,
            officePhone: result.data.officePhone,
            isCordinator: result.data.isCordinator,  
        });

        //const fs = require('fs');
        // ...
        if (file) {
            const photo = file["filename"];
            newProfessor.setPhoto(photo);
        }

        await Professor.create(newProfessor);

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
        const professors = await Professor.find();
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
        const { firstName, secondName, firstSurname, secondSurname, username, email, campus, cellPhone, officePhone, photo } = professor;

        // Construir el objeto de cuenta
        const account = {
            name: { firstName, secondName, firstSurname, secondSurname },
            username,
            email,
            campus,
            cellPhone,
            officePhone,
            photo
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
        const { id } = req.professor;
        const { file } = req;

        let updates = {
            username: req.body.username,
            firstName: req.body.firstName,
            secondName: req.body.secondName,
            firstSurname: req.body.firstSurname,
            secondSurname: req.body.secondSurname,
            email: req.body.email,
            campus: req.body.campus,
            //password: hashed,
            cellPhone: req.body.cellPhone,
            officePhone: req.body.officePhone
        }

        if (file){
            updates.photo = `http://localhost:3000/public/${file.filename}`;
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

        // Si no se encuentra ningún usuario, devuelve un error
        if (!professor) {
            return res.status(401).json({ error: 'Professor not found' });
        }

        // Compara la contraseña proporcionada con la contraseña almacenada en la base de datos
        const match = await comparePassword(password, professor.password);

        // Si la contraseña no coincide, devuelve un error
        if (!match) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // Devuelve un mensaje de éxito y los datos del usuario
        return res.status(200).json({ message: 'Login successful', professor });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


//elimina un profesor de la base de datos 

const deleteProfessor = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID del profesor de la URL
        //const { password } = req.body;

        // Buscar el profesor por su ID
        const professor = await Professor.findById(id);

        if (!professor) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verificar si la contraseña proporcionada coincide con la contraseña almacenada para el profesor
        /*if (!comparePassword(password, professor.password)) {
            return res.status(401).json({ error: 'Wrong password' });
        }*/

        // Eliminar el profesor de la base de datos
        await Professor.findByIdAndDelete(id);

        // Eliminar la foto del profesor si existe
        if (professor.photo) {
            const photoAddress = './storage/users/' + professor.photo.substring(28);
            deletePhoto(photoAddress);
        }

        return res.status(200).json({ message: 'Professor deleted' }); // Código 200: OK
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}




module.exports = {registerProfessor, getAllProfessor, getProfessor, editAccount, login, deleteProfessor}