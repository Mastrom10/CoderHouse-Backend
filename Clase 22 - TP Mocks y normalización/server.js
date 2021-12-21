const express = require('express')
const exphbs = require('express-handlebars')
const fs = require('fs');

const normalizr = require("normalizr");
const normalize = normalizr.normalize;
const denormalize = normalizr.denormalize;
const schema = normalizr.schema;

/* TP WebSockets */
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
/* TP WebSockets */

const app = express()
const httpServer = new HttpServer(app)
const srvSocket = new IOServer(httpServer)

const { productos, routerProductos } = require("./src/router/RouterProductos")

const { productosTest, routerProductosTest } = require("./src/router/RouterProductosTest")

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
app.use('/api/productos-test', routerProductosTest)
app.use(express.static('src/public'))





/* TP Normalizr */
const authorSchema = new schema.Entity('author');
const mensajeSchema = new schema.Entity('mensaje', {
  author: authorSchema
});
const listaMensajesSchema = new schema.Array(mensajeSchema);




/* TP WebSockets */
srvSocket.on('connection', async socket => {
  console.log('Nuevo cliente conectado!')
  const productitos = await productos();
  socket.emit('productosUpdate', { productitos })
  
  socket.on('nuevoMensaje', async mensaje => {
    mensaje.Hora = (new Date()).toLocaleString("en-ES");
    console.log(`Nuevo Mensaje: ${JSON.stringify(mensaje)}`)
    await GuardarEnArchivo(mensaje);
    srvSocket.sockets.emit('nuevoMensaje', await getMensajesNormalizados());
  })
})

app.post('/api/productos', async (req, res, next) => {
  const productitos = await productos();
  srvSocket.sockets.emit('productosUpdate', { productitos })
  next();
})

/* TP WebSockets */
const nombreArchivo = 'src/DBs/mensajes.json';

async function GuardarEnArchivo(mensaje){
  let mensajes = await fs.promises.readFile(nombreArchivo, 'utf8');
  if (mensajes == ""){
    mensajes = [];
  }
  mensajes = JSON.parse(mensajes);
  mensaje.id = mensajes.length + 1;
  mensajes.push(mensaje);
  await fs.promises.writeFile(nombreArchivo, JSON.stringify(mensajes));

}

async function getMensajesNormalizados(){
  let mensajes = await fs.promises.readFile(nombreArchivo, 'utf8');
  mensajes = JSON.parse(mensajes);
  const mensajesNormalizados = normalize(mensajes, listaMensajesSchema);
  return mensajesNormalizados;
}

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

/** TP Mocks y normalización **/
app.get('/ProductosTest', async (req, res) => {
  const productitos = await productosTest();
  res.render('verProductos.hbs', { productitos })
})


/* Iniciamos el servidor en el puerto 8080 */
const PORT = 8080
const server = httpServer.listen(PORT)
server.on('listening', () => {
    console.log(`ya me conecté al puerto ${server.address().port}`)
})
server.on('error', error => { console.log(error) })

