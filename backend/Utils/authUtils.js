const bcrypt = require('bcrypt');
const otp = require('otp-generator');
const jwt = require('jsonwebtoken');

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


/*
Genera un codigo de verificacion de 4 digitos.
Utiliza el modulo otp-generator para generar un codigo de verificacion de 4 digitos.
IN: nada
OUT: codigo de verificacion de 4 digitos
*/
const generateOTP = () => {
    return otp.generate(4, { 
        specialChars: false,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false
    });
}

/*
Esto es un middleware por lo que su ejecución es diferente a la de una funcion normal.

Verifica que el token de reseteo de contraseña sea valido. Es decir que se haya firmado con la llave correcta.
Utiliza el modulo jsonwebtoken para verificar que el token de reseteo de contraseña sea valido.
toma 3 parámetros req, res y next. req es el request, res es el response y next es una funcion que se ejecuta si el token es valido.
IN:
    + req: request. Contiene el token de reseteo de contraseña en la cookie resetToken.
    + res: response. Contiene la respuesta que se le va a enviar al usuario.
    + next: funcion que se ejecuta si el token es valido. (callback)
OUT:
    + req: Se agrega el campo user a req el cual contiene el payload del token de reseteo de contraseña.
           El payload es un objeto que contiene el id del usuario y se ejecuta la funcion next.
    x res: Se envia un error 401 si el token no es valido.
    x res: Se envia un error 500 si ocurre un error en el servidor al verificar el token de reseteo de contraseña.
*/
const checkToken = async (req, res, next) => {
    try{
        const { resetToken } = req.cookies;
        
        if (!resetToken){
            return res.status(401).json({ error: 'Expected a token.' });
        }

        const payload = jwt.verify(resetToken, process.env.ACCESS_TOKEN_SEQUENCE);        
        req.user = payload;
        next();
    }catch(err){
        console.log(err);
        res.status(401).json({ error: 'You are not authorized.' });
    }
}

module.exports = {hashPassword, comparePassword, generateOTP, checkToken}