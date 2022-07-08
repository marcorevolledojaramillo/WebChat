const dbValidator = require('./db-validators');
const generarJWT = require('./generar-JWT');
const googleVerifity = require('./google-verifity');
const subirArchivo = require('./subir-archivo');
const crearCarpeta = require('./archivos');

module.exports={
    ...dbValidator,
    ...generarJWT,
    ...googleVerifity,
    ...subirArchivo,
    ...crearCarpeta
}
