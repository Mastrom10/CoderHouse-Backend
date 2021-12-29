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


/* TP Login por Formulario */
const session = require('express-session')
const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
/* TP Login por Formulario */


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


/* TP Login por Formulario */
app.use(session({
  store: MongoStore.create({
      //En Atlas connect App :  Make sure to change the node version to 2.2.12:
      mongoUrl: 'mongodb+srv://admin:Merluza23@cluster0.vuapg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
      mongoOptions: advancedOptions
  }),
  /* ----------------------------------------------------- */

  secret: 'shhhhhhhhhhhhhhhhhhhhh',
  resave: false,
  saveUninitialized: false ,
  cookie: {
      maxAge: 600000
  } 
}))

/* TP Login por Formulario */
/* middleware verifica session */
app.use(async (req, res, next) => {
  if (req.session.nombre || req.url == '/login' || req.url == '/logout') {
    req.session.contador = req.session.contador+1 || 1;
    next();
  } else {
    res.redirect('/login');
  }
})




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
  res.render('verProductos.hbs', { productitos, nombreUsuario: req.session.nombre })
})

app.get('/productos', async (req, res) => {
  const productitos = await productos();
  res.render('CargarProductos.hbs', { productitos, nombreUsuario: req.session.nombre })
})

/** TP Mocks y normalización **/
app.get('/ProductosTest', async (req, res) => {
  const productitos = await productosTest();
  res.render('verProductos.hbs', { productitos, nombreUsuario: req.session.nombre })
})

/* Login por Formulario */
app.get('/login', (req, res) => {
  res.render('login.hbs')
})

app.post('/login', async (req, res) => {
  const { nombre } = req.body;
  req.session.nombre = nombre;
  res.redirect('/');
}
);

app.get('/logout', (req, res) => {
  res.render('logout.hbs', {logout:true, nombreUsuario: req.session.nombre})
  req.session.destroy();
})



/* TP Login por Formulario */
/* Prueba de Session */
app.get('/session', (req, res) => {
  if (req.session.contador) {
      req.session.contador++
      res.send(`Ud ha visitado el sitio ${req.session.contador} veces.`)
  } else {
      req.session.contador = 1
      res.send('Bienvenido!')
  }
})


/* Iniciamos el servidor en el puerto 8080 */
const PORT = 8080
const server = httpServer.listen(PORT)
server.on('listening', () => {
    console.log(`ya me conecté al puerto ${server.address().port}`)
})
server.on('error', error => { console.log(error) })

