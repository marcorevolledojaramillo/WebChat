const { response } = require("express");
const { Categoria } = require('../models')


const obtenerCategorias = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;

    const [totalBase, categorias] = await Promise.all([
        Categoria.count({ estado: true }),
        Categoria.find({ estado: true })
            .populate({
                path: 'usuario',
                select: ['nombre', 'correo']
            })
            .skip(desde)
            .limit(limite)
    ]);

    const total = categorias.length
    res.status(200).json({
        msg: `Status 200`,
        totalEnBasedeDatos: totalBase,
        totalConsulta: total,
        categorias

    });
}

const obtenerCategoriasByID = async (req, res = response) => {

    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate({
        path: 'usuario',
        select: ['nombre', 'correo']
    });

    if (!categoria.estado) {
        res.status(400).json({
            msg: 'No se encuentra este producto en la base de datos'
        })
    }

    res.status(200).json({
        msg: `Status 200`,
        categoria

    });
}

const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: 'La categoria que intenta guardar ya se encuentra creada'
        })
    }

    data = {
        nombre,
        usuario: req.usuario._id
    }
    const categoria = new Categoria(data);
    await categoria.save();
    return res.status(201).json({
        msg: `La categoria fue creada con exito`,
        categoria
    })
}

const actualizarCategoria = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { estado, usuario, ...resto } = req.body;
        resto.nombre = resto.nombre.toUpperCase();
        resto.usuario = req.usuario._id;
        const categoria = await Categoria.findByIdAndUpdate(id, resto, { new: true })
        res.status(200).json({
            msg: 'CATEGORIA ACTUALIZADA',
            categoria
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Comuniquese con el administrador- Problemas para actualizar'
        })
    }
}

const EliminarCategoria = async (req, res = response) => {
    try {
        const { id } = req.params;
        const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true })
        return res.status(200).json({
            msg: 'CATEGORIA BORRADA',
            categoriaBorrada
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Comuniquese con el administrador- Problemas para eliminar'
        })

    }




}

module.exports = {
    obtenerCategorias,
    obtenerCategoriasByID,
    crearCategoria,
    actualizarCategoria,
    EliminarCategoria
}