const Student = require('../Models/Student');
const {validateStudent} = require('../Utils/studentValidator');
const mongoose = require('mongoose');



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

       

        const newStudent = Student({
            firstName: result.data.firstName,
            secondName: result.data.secondName,
            firstSurname: result.data.firstSurname,
            secondSurname: result.data.secondSurname,
            email: result.data.email,
            campus: result.data.campus,
            cellPhone: result.data.cellPhone,
            carnet: result.data.carnet 
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
        const students = await Student.find();
        return res.status(200).json({students});
    }catch(error){
        console.log(error);
        return res.status(500).json({error: 'Internal server error'})
    }
}


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
        const { firstName, secondName, firstSurname, secondSurname, email, campus, cellPhone, carnet } = student;

        // Construir el objeto de cuenta
        const account = {
            name: { firstName, secondName, firstSurname, secondSurname },
            email,
            campus,
            cellPhone,
            carnet
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


const getStudentsByCampus = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar todos los estudiantes que tienen el ID del campus en su campo 'campus'
        const students = await Student.find({ campus: id });

        if (!students || students.length === 0) {
            return res.status(404).json({ error: 'No students found in this campus' });
        }

        return res.status(200).json({ students });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};



module.exports = { registerStudent, getAllStudent, getStudent, deleteStudent,
    getStudentsByCampus }