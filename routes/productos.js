const { Router } = require('express');
const {check} = require('express-validator')

const { obtenerProductos,obtenerProductoByID, 
       crearProducto, editarProducto, eliminarProducto } = require('../controllers');
const { ProductoExisteById, validacionCategoria } = require('../helpers');
const { validarCampos, validarJWT, tieneRole } = require('../middlewares');


const router = new Router();


// OBTENER TODAS LAS CATEGORIAS - PUBLICO
router.get('/', obtenerProductos);

router.get('/:id',[
    check('id','Necesita un id valido').isMongoId(),
    check('id').custom(ProductoExisteById),
    validarCampos
] ,obtenerProductoByID)

router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').notEmpty(),
    //heck('precio','No puede ser un string').isNumeric(),
    check('categoria','Necesita ser un id Valido').isMongoId(),
    check('categoria').custom(validacionCategoria),

    validarCampos
],crearProducto)

router.put('/:id',[
    validarJWT,
    check('id','Inserte un ID valido para actualizar').isMongoId(),
    //check('categoria', 'No es un ID valido').isMongoId(),
    check('id').custom(ProductoExisteById),
    validarCampos
],editarProducto)

router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id','Necesita un ID Valido').isMongoId(),
    check('id').custom(ProductoExisteById),
    validarCampos
] ,eliminarProducto)
module.exports = router;
module.exports = router;