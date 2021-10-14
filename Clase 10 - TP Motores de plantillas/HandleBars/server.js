const express = require('express')
const exphbs = require('express-handlebars')


const { productos, routerProductos } = require("./src/router/RouterProductos")

const app = express()

app.use(express.json())

app.use(express.urlencoded({ extended: true }))


/* ------------------------------------------------------ */
/* Cargamos el motor de vistas.  */
app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'index.hbs'
  }));
app.set('view engine', 'handlebars');
app.set('views', './views') 

/* ------------------------------------------------------ */
/* Cargamos las Views con los formularios.  */
app.get('/', async (req, res) => {
    const productitos = await productos();
    console.log(productitos)
    res.render('verProductos.hbs', {productitos})
  })

  app.get('/productos', async (req, res) => {
    res.render('CargarProductos.hbs')
  })


/* ------------------------------------------------------ */
/* Cargamos Los Routers de los sistemas.  */

app.use('/api/productos', routerProductos)

const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))

