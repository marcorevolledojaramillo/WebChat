const {Router} = require('express');
const { buscar } = require('../controllers');


const router= Router();

router.get('/:coleccion/:termino',buscar);

module.exports= router;