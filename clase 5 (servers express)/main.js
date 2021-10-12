const http = require('http');

const server = http.createServer((peticion, respuesta) => {

    const time = new Date().getHours();
    if (time >= 6 && time <= 12) {
        respuesta.end('Buenos días!')
    } else if (time >= 12 && time <= 18) {
        respuesta.end('Buenas tardes')
    } else {
        respuesta.end('Buenas noches')
    }
})

const connectedServer = server.listen(8080, () => {
    console.log(`Servidor Http escuchando en el puerto ${connectedServer.address().port}`)
})


