const { comprobarJWT } = require("../helpers/generar-JWT");
const ChatMensajes = require("../models/chat-mensajes");

const chatMensajes = new ChatMensajes();
const socketController = async (socket = new Socket, io) => {

    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);

    if (!usuario) {
        return socket.disconnect();
    }

    //Agregar usuario conectado
    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosActivos);
    socket.emit('recibir-mensajes', chatMensajes.ultimos10)

    socket.join(usuario.id);


    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosActivos);

    })

    socket.on('enviar-mensaje', ({ uid, mensaje }) => {
        console.log(uid);
        if (uid) {
            socket.to(uid).emit('mensaje-privado', { de: usuario.nombre, mensaje })
        } else {
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10)
        }

    })


}

module.exports = {
    socketController
}