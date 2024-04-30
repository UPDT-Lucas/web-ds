const multer = require('multer')
const fs = require('fs')
const { register } = require('module')
const { env } = require('process')
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const destinationPath = path.resolve(__dirname, '../storage/professor');
        cb(null, destinationPath)
    },
    filename: function(req, file, cb){
        cb(null,  file.fieldname + '-' + Date.now() + '.png')
    }
})

function deletePhoto(photo){
    try{
        fs.rmSync(photo, { recursive: true }) 
    } catch(e){
    }
}

const uploadPhoto = function (destination) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const destinationPath = path.resolve(__dirname,"../storage/" + destination);
            cb(null, destinationPath)
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + '.png')
        }

    });

    const upload = multer({ storage }).single('photo');
    console.log(upload);

    return upload;
};


const upload = multer({ storage })


module.exports = { upload, deletePhoto, uploadPhoto}