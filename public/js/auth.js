
const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:3000/api/auth/'
    : 'https://app-webserver-rest.herokuapp.com/api/auth/';



const miFormulario = document.querySelector('form')

miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    for (let el of miFormulario.elements) {
        if (el.name.length > 0)
            formData[el.name] = el.value
    }
    console.log('1.',formData);


    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(resp => resp.json())
        .then(({ msg, token }) => {

            if(msg){
                return console.error(msg)
            }
            localStorage.setItem('token', token);
            window.location='chat.html';
        })
        .catch(console.warn)

});

function handleCredentialResponse(response) {
    const body = { id_token: response.credential }
    fetch(url + "google", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(resp => resp.json())
        .then(({ token }) => {
            localStorage.setItem('token', token);
            window.location='chat.html';
        })
        .catch(err => {
            console.log(err)
        })
}

