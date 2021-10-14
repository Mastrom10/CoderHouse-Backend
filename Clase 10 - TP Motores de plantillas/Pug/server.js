const express = require('express')


const { productos, routerProductos } = require("./src/router/RouterProductos")

const app = express()

app.use(express.json())

app.use(express.urlencoded({ extended: true }))


/* ------------------------------------------------------ */
/* Cargamos el motor de vistas.  */
 
app.set('view engine', 'pug');
app.set('views', './views') 

/* ------------------------------------------------------ */
/* Cargamos las Views con los formularios.  */
app.get('/', async (req, res) => {
    const productitos = await productos();
    res.render('verProductos.pug', {productitos})
  })

  app.get('/productos', async (req, res) => {
    res.render('CargarProductos.pug')
  })


/* ------------------------------------------------------ */
/* Cargamos Los Routers de los sistemas.  */

app.use('/api/productos', routerProductos)

const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))

