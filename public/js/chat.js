
const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:3000/api/auth/'
    : 'https://app-webserver-rest.herokuapp.com/api/auth/';

const nombrePagina = document.querySelector('#nombre');
const button = document.getElementById('google_signout');
var txtUid = document.querySelector('#txtUid')
const txtMensaje = document.querySelector('#txtMensaje')
const ulUsuarios = document.querySelector('#ulUsuarios')
const ulChats = document.querySelector('#ulChats')
const btnEnviar = document.querySelector('#btnEnviar')



let usuario = null;
let socket = null;

button.onclick = () => {
    google.accounts.id.disableAutoSelect()
    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        localStorage.clear();
        window.location = 'index.html';
    })
}

btnEnviar.addEventListener('click', () => {
    const mensaje = txtMensaje.value;
    const uid = txtUid.value
    if (mensaje.length <= 0) {
    }
    socket.emit('enviar-mensaje', { uid, mensaje });

    txtMensaje.value = '';
})

txtMensaje.addEventListener('keyup', ({ keyCode }) => {

    const mensaje = txtMensaje.value;
    const uid = txtUid.value
    if (keyCode !== 13) { return; }
    if (mensaje.length <= 0) {
    }
    socket.emit('enviar-mensaje', { uid, mensaje });

    txtMensaje.value = '';

})

const validarJWT = async () => {
    const token = localStorage.getItem('token') || '';
    if (token.length <= 10) {
        window.location = 'login.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch(url, {
        headers: { 'x-token': token }
    })

    const { usuario: userDB, token: tokenDB } = await resp.json();

    localStorage.setItem('token', tokenDB)
    usuario = userDB;
    document.title = usuario.nombre.toUpperCase();
    nombrePagina.innerHTML = usuario.nombre;
    await conectarSocket();
}

const conectarSocket = async () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });


    socket.on('connect', () => {
    })

    socket.on('disconnect', () => {
    })
    socket.on('recibir-mensajes', (payload) => {
        mostrarMensajes(payload);
    })
    socket.on('usuarios-activos', usuariosActivos)
    socket.on('mensaje-privado', ({nombre, mensaje}) => {
        chatHtml += `
            <li class="list-group-item" >
                    <p>
                    <span class="text-info">${nombre}:</span>
                    ${mensaje}
                    </p>
            </li>
        
        `


        ulChats.innerHTML = chatHtml;

        
    })


}

const usuariosActivos = (usuarios = []) => {
    let userHtml = '';
    usuarios.forEach(({ nombre, uid }) => {
        userHtml += `
            < li >
            <p class="text-bg-light">
                <h5 class="text-light">${nombre}</h5>
                <span class="fs-6 test-muted">${uid}</span>
            </p>
            </li >

    `
    });

    ulUsuarios.innerHTML = userHtml;
}

const mostrarMensajes = (mensajes = []) => {

    let chatHtml = '';
    mensajes.forEach(({ nombre, mensaje }) => {
        chatHtml += `
    < li class="list-group-item" >
        <p>
            <span class="text-info">${nombre}:</span>
            ${mensaje}
        </p>
            </li >

    `
    });

    ulChats.innerHTML = chatHtml;
}


const main = async () => {
    await validarJWT();

}


main();



