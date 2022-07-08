const { Router } = require('express');
const { check } = require('express-validator');


const { crearCategoria,obtenerCategorias, obtenerCategoriasByID,
      actualizarCategoria, EliminarCategoria } = require('../controllers');
const { categoriaExisteById, categoriaExisteByNombre } = require('../helpers');
const { validarCampos, validarJWT, tieneRole, esAdminRole } = require('../middlewares')


const router = new Router();


// OBTENER TODAS LAS CATEGORIAS - PUBLICO
router.get('/', obtenerCategorias)

// OBTENER UNA CATEGORIAS POR ID- PUBLICO
router.get('/:id',[
     check('id','El Id ingresado no es un id valido').isMongoId(),
     check('id').custom(categoriaExisteById),
     validarCampos
], obtenerCategoriasByID)

// CREAR CATEGORIA -PRIVADO - CUALQUIER PERSONA CON TOKEN VALIDO
router.post('/', [
     validarJWT,
     check('nombre').custom(categoriaExisteByNombre),
     check('nombre', 'El nombre es obligatorio').notEmpty(),
     validarCampos
], crearCategoria )

// ACTUALIZAR CATEGORIA - PRIVADO - CULQUEIRA CON TOKEN VALIDO
router.put('/:id',[
     validarJWT,
     check('id','Necesita un ID Valido').isMongoId(),
     check('id').custom(categoriaExisteById),
     check('nombre', 'El nombre no puede ser vacio').notEmpty(),
     validarCampos
], actualizarCategoria)

// BORRAR UNA CATEGORIA - ADMIN
router.delete('/:id', [
     validarJWT,
     tieneRole('ADMIN_ROLE'),
     check('id','Necesita un ID Valido').isMongoId(),
     check('id').custom(categoriaExisteById),
     validarCampos
] ,EliminarCategoria)
module.exports = router;