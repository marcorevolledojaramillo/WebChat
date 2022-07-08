
const bcryptjs = require('bcryptjs');
const { response } = require('express');

const {Usuario} = require('../models');


const getUsuarios = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;

    const [totalBase, usuarios] = await Promise.all([

        Usuario.count({ estado: true }),
        Usuario.find({ estado: true })
            .skip(desde)
            .limit(limite)
    ]);
    const total = usuarios.length
    return res.json({
        totalBase,
        total,
        usuarios
    })
}
const postUsuarios = async (req, res) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    //Verificar el coreo existe

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //Guardar
    await usuario.save();

    return res.status(201).json({
        usuario
    });
}
const putUsuarios = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, ...resto } = req.body;

    //VALIDAR CONTRA BASE DE DATOS
    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    return res.status(202).json({
        usuario
    });


}
const deleteUsuarios = async (req, res) => {
    const { id } = req.params;
    console.log(id);
   
    // const usuario= await Usuario.findByIdAndDelete(id);
    const usuarioBorrado = await Usuario.findByIdAndUpdate(id, { estado: false });
    
    return res.status(200).json({
        usuarioBorrado
    });
}
// const patchUsuarios = (req, res) => {
//     const { id } = req.params;

//     res.json({
//         msg: 'Patch API-Controller'
//     });
// }
module.exports = {
    getUsuarios,
    postUsuarios,
    putUsuarios,
    deleteUsuarios,
    // patchUsuarios
}