const express = require('express')
const exphbs = require('express-handlebars')
const fs = require('fs');

/* TP WebSockets */
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
/* TP WebSockets */

const app = express()
const httpServer = new HttpServer(app)
const srvSocket = new IOServer(httpServer)

const { productos, routerProductos } = require("./src/router/RouterProductos")

const mensajesDAO = require('./src/DBs/MensajesDAO.js')

/* ------------------------------------------------------ */
/* Cargamos el motor de vistas.  */
app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'index.hbs'
}));
app.set('view engine', 'handlebars');
app.set('views', './views')

/* ------------------------------------------------------ */
/* Cargamos Los Routers/Middlewares de los sistemas.  */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/productos', routerProductos)
app.use(express.static('src/public'))



/* TP WebSockets */
srvSocket.on('connection', async socket => {
  console.log('Nuevo cliente conectado!')
  const productitos = await productos();
  socket.emit('productosUpdate', { productitos })
  
  socket.on('nuevoMensaje', mensaje => {
    mensaje.Hora = (new Date()).toLocaleString("en-ES");
    console.log(`Nuevo Mensaje: ${mensaje}`)
    //GuardarEnArchivo(mensaje);
    mensajesDAO.insertarMensaje(mensaje);
    srvSocket.sockets.emit('nuevoMensaje', mensaje);
  })
})

app.post('/api/productos', async (req, res, next) => {
  const productitos = await productos();
  srvSocket.sockets.emit('productosUpdate', { productitos })
  next();
})

/* TP WebSockets */
/* TP WebSockets */
const nombreArchivo = 'src/DBs/mensajes.json';

async function GuardarEnArchivo(mensaje){
//TO DO
const MensajeEnJson = '\n' + JSON.stringify(mensaje);

await fs.promises.appendFile(nombreArchivo, MensajeEnJson)

}



//app.use(express.static('src/public'))

/* ------------------------------------------------------ */
/* Cargamos las Views con los formularios.  */
app.get('/', async (req, res) => {
  const productitos = await productos();
  console.log(productitos)
  res.render('verProductos.hbs', { productitos })
})

app.get('/productos', async (req, res) => {
  const productitos = await productos();
  res.render('CargarProductos.hbs', { productitos })
})



// const PORT = 8080
// const server = app.listen(PORT, () => {
//   console.log(`Servidor escuchando en el puerto ${server.address().port}`)
// })
// server.on('error', error => console.log(`Error en servidor ${error}`))



const PORT = 8080
const server = httpServer.listen(PORT)
server.on('listening', () => {
    console.log(`ya me conecté al puerto ${server.address().port}`)
})
server.on('error', error => { console.log(error) })

