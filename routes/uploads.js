const { Router } = require('express');
const { check } = require('express-validator');

const { cargarArchivos, mostrarImagen, actualizarImagenCloudinary } = require('../controllers');
const { coleccionesPermitida } = require('../helpers');
const { validarCampos, validarJWT, validarArchivosSubir } = require('../middlewares');


const router = new Router();

router.post('/',validarArchivosSubir ,cargarArchivos)

router.put('/:coleccion/:id', [
    validarJWT,
    validarArchivosSubir,
    check('coleccion').custom(c => coleccionesPermitida( c, ['usuarios', 'productos'])),
    check('id', 'El id debe ser de mongoID').isMongoId(),
    validarCampos
], actualizarImagenCloudinary)

router.get('/:coleccion/:id',[
    check('coleccion').custom(c => coleccionesPermitida( c, ['usuarios', 'productos'])),
    check('id', 'El id debe ser de mongoID').isMongoId(),
    validarCampos
],mostrarImagen)
module.exports = router;