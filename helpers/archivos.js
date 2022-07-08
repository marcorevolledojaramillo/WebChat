const fs = require('fs');

const crearCarpeta = (nombreCarpeta = '') => {
    if (nombreCarpeta.length = 0) {
        throw new Error('Ingrese el nombre de la carpeta que desea crear, es necesario.')
    }

    if (!fs.existsSync(`./${nombreCarpeta}/`)) {
        fs.mkdirSync(`./${nombreCarpeta}/`, { recursive: true });
    }
    return `/${nombreCarpeta}/`;

};


module.exports = {
    crearCarpeta
}

