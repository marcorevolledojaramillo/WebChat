const { response } = require("express");
const { Producto } = require('../models')



const obtenerProductos = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;

    const [totalBase, productos] = await Promise.all([
        Producto.count({ estado: true }),
        Producto.find({ estado: true })
            .populate({
                path: 'usuario',
                select: ['nombre', 'correo']
            })
            .populate('categoria', 'nombre')
            .skip(desde)
            .limit(limite)
    ]);

    const total = productos.length
    return res.status(200).json({
        msg: 'CONSULTA EXITOSA',
        totalEnBasedeDatos: totalBase,
        totalConsulta: total,
        productos

    });
}
const obtenerProductoByID = async (req, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findById(id)
        .populate({
            path: 'usuario',
            select: ['nombre', 'correo']
        })
        .populate('categoria', 'nombre');

        return res.status(200).json({
        msg: 'CONSULTA EXITOSA',
        producto
    })
}
const crearProducto = async (req, res = response) => {
    try {
        const {
            estado, usuario, ...resto
        } = req.body;

        const productoBD = await Producto.findOne({ nombre: resto.nombre })

        if (productoBD) {
            res.status(400).json({
                msg: 'Ya existe un producto con este nombre'
            })
        }
        if (resto.precio) {
            if (isNaN(resto.precio)) {
                res.status(400).json({
                    msg: 'El precio no puede ser una cadena de texto, ingrese un valor correcto.',
                    valorIngresado: resto.precio
                })
            }
        }
        resto.nombre = resto.nombre.toUpperCase();
        const producto = new Producto(resto);
        producto.usuario = req.usuario._id;
        await producto.save();

        return res.status(201).json({
            msg: 'PRODUCTO CREADO',
            producto
        })
    } catch (error) {
        console.log('\nERROR AL CREAR PRODUCTO\n')
    }

}
const editarProducto = async (req, res = response) => {

    try {
        const {
            _id, estado, usuario, ...resto
        } = req.body;

        const { id } = req.params;

        const productoBD = await Producto.findById(id);

        if (productoBD == resto.nombre) {
            return res.status(400).json({
                msg: 'Ya existe un producto con este nombre'
            })
        }
        if (resto.precio) {
            if (isNaN(resto.precio)) {
                res.status(400).json({
                    msg: 'El precio no puede ser una cadena de texto, ingrese un valor correcto.',
                    valorIngresado: resto.precio
                })
            }
        }
        resto.nombre = resto.nombre.toUpperCase();
        resto.usuario = req.usuario._id;
        const productoActualizado = await Producto.findByIdAndUpdate(id, resto, { new: true })

        return res.status(200).json({
            msg: 'REGISTRO ACTUALIZADO CORRECTAMENTE',
            productoActualizado
        })
    } catch (error) {
        console.log('\nERROR AL EDITAR PRODUCTO\n')
        return res.status(500).json({
            msg: ' Comuniquese con el administrador, no se pudo actualizar'
        })
    }

}

const eliminarProducto = async (req, res = response) => {
    try {
        const { id } = req.params;
        const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });
        return res.status(200).json({
            msg: 'PRODUCTO BORRADO CORRECTAMENTE',
            productoBorrado
        })
    } catch (error) {
        console.log('ERROR AL ELIMINAR');
        return res.status(500).json({
            msg: 'Comuniquese con el administrador - Problemas al elimianr'
        })
    }
}
module.exports = {
    obtenerProductos,
    obtenerProductoByID,
    crearProducto,
    editarProducto,
    eliminarProducto
}