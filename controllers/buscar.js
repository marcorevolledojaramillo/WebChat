const { response } = require("express");
const { default: mongoose } = require("mongoose");

const { Usuario, Producto, Categoria } = require("../models");

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'usuarios',
    'roles',
]

const buscarUsuarios = async (termino = '', res = response) => {
    const esMongoID = mongoose.isValidObjectId(termino);
    if (esMongoID) {
        const usuarioBusqueda = await Usuario.find({ _id: termino, estado: true },);

        return res.status(200).json({
            msg: 'BUSQUEDA REALIZADA',
            results: (usuarioBusqueda) ? [usuarioBusqueda] : []
        })
    }
    const regex = new RegExp(termino, 'i')
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    })
    return res.status(200).json({
        msg: 'BUSQUEDA REALIZADA',
        results: (usuarios) ? [usuarios] : []
    })

}

const buscarProductos = async (termino = '', res = response) => {
    const esMongoID = mongoose.isValidObjectId(termino);
    if (esMongoID) {
        const productoBusqueda = await Producto.find({ _id: termino, estado: true })
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre');

        return res.status(200).json({
            msg: 'BUSQUEDA REALIZADA',
            results: (productoBusqueda) ? [productoBusqueda] : []
        })
    }
    const regex = new RegExp(termino, 'i')
    const productos = await Producto.find({
        $or: [{ nombre: regex },{ descripcion: regex }],
        $and: [{ estado: true }]
        })
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre')
    return res.status(200).json({
        msg: 'BUSQUEDA REALIZADA',
        results: (productos) ? [productos] : []
    })

}
const buscarCategorias = async (termino = '', res = response) => {
    const esMongoID = mongoose.isValidObjectId(termino);
    if (esMongoID) {
        const categoriaBusqueda = await Categoria.find({ _id: termino, estado: true },);

        return res.status(200).json({
            msg: 'BUSQUEDA REALIZADA',
            results: (categoriaBusqueda) ? [categoriaBusqueda] : []
        })
    }
    const regex = new RegExp(termino, 'i')
    const categorias = await Categoria.find({
        $or: [
            { nombre: regex },
        ],
        $and: [{ estado: true }]
    })
    return res.status(200).json({
        msg: 'BUSQUEDA REALIZADA',
        results: (categorias) ? [categorias] : []
    })

}

const buscar = async (req, res = response) => {

    const { coleccion, termino } = req.params

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: 'La coleccion que a la que intenta acceder no existe',
            coleccionesPermitidas: `${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'categorias':
            buscarCategorias(termino, res);
            break;

        case 'productos':
            buscarProductos(termino, res);
            break;

        case 'usuarios':
            buscarUsuarios(termino, res);
            break

        default:
            res.status(500).json({
                msg: 'No se ha implementado esta busqueda'
            });
            break;
    }


}

module.exports = {
    buscar
}