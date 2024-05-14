const Campus = require('../Models/Campus');
const {validateCampus} = require('../Utils/campusValidator');
const mongoose = require('mongoose');

const registerCampus = async (req, res) => {
    try {
        const result = validateCampus(req.body);

        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) });
        }

        // Verificar si el campus ya existe por su nombre
        const exists = await Campus.findOne({ campusName: result.data.campusName });

        if (exists) {
            return res.status(400).json({ error: 'A campus with this name already exists!' });
        }

        // Crear un nuevo campus
        const newCampus = new Campus({
            campusName: result.data.campusName
        });

        await newCampus.save();

        return res.status(201).json({ message: 'Campus created' });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}



//------------------------------------------------

const getAllCampus = async(req, res) => {
    try{
        const campus = await Campus.find();
        return res.status(200).json({campus});
    }catch(error){
        console.log(error);
        return res.status(500).json({error: 'Internal server error'})
    }
}

//------------------------------------------------


const getCampus = async (req, res) => {
    try {
        const { id } = req.params;
        // Buscar el campus por su ID
        const campus = await Campus.findById( id );

        if (!campus) {
            return res.status(404).json({ error: 'Campus not found' });
        }

        // Devolver la información del campus
        return res.status(200).json({ campus });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {registerCampus, getAllCampus, getCampus}