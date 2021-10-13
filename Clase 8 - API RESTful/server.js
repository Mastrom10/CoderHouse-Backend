const express = require('express')


const { routerProductos } = require("./src/router/RouterProductos")

const app = express()

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

/* ------------------------------------------------------ */
/* Cargamos las webs staticas con los formularios.  */
app.use('/', express.static('src/public'))

/* ------------------------------------------------------ */
/* Cargamos Los Routers de los sistemas.  */

app.use('/api/productos', routerProductos)

const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))

