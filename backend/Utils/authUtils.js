const bcrypt = require('bcrypt');


/*
Encripta la contraseña que se envia en texto plano utilizando bcrypt ( método blowfish cipher) y retorna la contraseña encriptada.
toma un parametro password que es la contraseña en texto plano.
IN: contraseña en texto plano
OUT: contraseña encriptada
*/

const hashPassword = async (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err){
                reject(err);
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err){
                    reject(err);
                }
                resolve(hash); 
            });
        });
    });
}

/*
Compara la contraseña en texto plano con la contraseña encriptada y retorna true si son iguales.
Utiliza un metodo de bcrypt para comparar las contraseñas.
toma dos parametros password que es la contraseña en texto plano y hash que es la contraseña encriptada.
IN: contraseña en texto plano y contraseña encriptada (password y hash respectivamente)
OUT: true si son iguales, false si no lo son
*/
const comparePassword = async (password, hash) => {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch; 
}

module.exports = {hashPassword, comparePassword}