const { response } = require("express");
const fs = require("fs");
const path = require('path');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)


const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");


const cargarArchivos = async (req, res = response) => {

    try {
        const respuesta = await subirArchivo(req.files);
        res.status(respuesta.status).json({
            nombre: respuesta.msg
        })
    } catch (msg) {
        res.status(400).json({
            msg
        })
    }

}

const actualizarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;
    let modelo;
    const usuario = await Usuario.findById(req.usuario._id);

    switch (coleccion) {
        case 'usuarios':

            if (!(usuario.id == id)) {
                if (!(usuario.rol == 'ADMIN_ROLE')) {
                    return res.status(401).json({
                        msg: 'Autentiquese con el usuario que desea cambiar la foto'
                    })
                }
            }
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No se encuentra un usuario con ID: ${id}`
                })
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No se encuentra un producto con ID: ${id}`
                })
            }
            modelo.usuario = req.usuario._id;
            break;

        default:
            return res.status(500).json({
                msg: 'Todavia esta coleccion no esta implementada'
            })
            break;
    }

    try {
        limpiarImagenesPrevias(modelo, coleccion);
        const respuesta = await subirArchivo(req.files, coleccion);
        modelo.img = respuesta.msg;

        await modelo.save();

        return res.status(respuesta.status).json({
            modelo
        })
    } catch (msg) {
        res.status(400).json({
            msg
        })
    }
}
const limpiarImagenesPrevias = (modelo, coleccion) => {
    if (modelo.img) {

        const nombreArr = modelo.img.split('/')
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');

        cloudinary.uploader.destroy(`RestServer NodeJs/${coleccion}/${public_id}`)

    }
}

const mostrarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo || !modelo.estado) {
                return res.status(400).json({
                    msg: `No se encuentra un usuario con ID: ${id}`
                })
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No se encuentra un producto con ID: ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Todavia esta coleccion no esta implementada'
            })

    }

    try {
        if (modelo.img) {
            return res.status(200).redirect(modelo.img);


        } else if (!modelo.img) {
            const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
            if (fs.existsSync(pathImagen)) {
                return res.status(200).sendFile(pathImagen);
            } else {
                return res.status(200).json({
                    msg: 'No se encuentra la imagen por defecto'
                });
            }
        }
        return res.status(500).json({
            msg: 'El directorio donde se encontraba esta imagen fue eliminado, comuniquese con el administrador'
        })

    } catch (msg) {
        res.status(400).json({
            msg: 'Comuniquese con el administrador'
        })
    }
}


const actualizarImagenCloudinary = async (req, res = response) => {
    const { id, coleccion } = req.params;
    let modelo;
    const usuario = await Usuario.findById(req.usuario._id);

    switch (coleccion) {
        case 'usuarios':

            if (!(usuario.id == id)) {
                if (!(usuario.rol == 'ADMIN_ROLE')) {
                    return res.status(401).json({
                        msg: 'Autentiquese con el usuario que desea cambiar la foto'
                    })
                }
            }
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No se encuentra un usuario con ID: ${id}`
                })
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No se encuentra un producto con ID: ${id}`
                })
            }
            modelo.usuario = req.usuario._id;
            break;

        default:
            return res.status(500).json({
                msg: 'Todavia esta coleccion no esta implementada'
            })
            break;
    }

    try {
        limpiarImagenesPrevias(modelo, coleccion);
        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: `RestServer NodeJs/${coleccion}` })
        // const respuesta = await subirArchivo(req.files, coleccion);
        modelo.img = secure_url;

        await modelo.save();

        return res.status(200).json({
            modelo
        })
    } catch (msg) {
        res.status(400).json({
            msg
        })
    }
}




module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}