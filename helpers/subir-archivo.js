const { nanoid } = require('nanoid');
const path = require('path')

const { crearCarpeta } = require('./archivos');
const subirArchivo = (files, carpeta = '', extensionesValidas = ['jpg', 'jpeg', 'png', 'gif']) => {

    return new Promise((resolve, reject) => {
        const { archivo } = files;

        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        if (!extensionesValidas.includes(extension)) {

            return reject({
                status:400,
                msg:`${extension} no es un tipo archivo permitido- Solo se permite: ${extensionesValidas}`})

        }

        const nombreArchivo = nanoid() + '.' + extension;
        const ubicacion = path.join(__dirname, `../uploads/`,carpeta, nombreArchivo);

        archivo.mv(ubicacion, function (err) {
            if (err) {
                console.log(err)
                return reject({
                    status:500,
                    msg:'Error al subir el archivo comuniquese con el administrador'})
            }

            resolve({
                status:200,
                msg:nombreArchivo});
        })

    })
}

module.exports = {
    subirArchivo
}

