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
/* TP Login por Formulario */


/*TP Inicio de Sesión*/

const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
/*TP Inicio de Sesión*/




const app = express()
const httpServer = new HttpServer(app)
const srvSocket = new IOServer(httpServer)

const { productos, routerProductos } = require("./src/router/RouterProductos")

const { productosTest, routerProductosTest } = require("./src/router/RouterProductosTest")

const { UsuariosDao } = require('./src/DBs/UsuariosDao')

const miUsuarioDAO = new UsuariosDao();

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
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
app.use(session({
  store: MongoStore.create({
    //En Atlas connect App :  Make sure to change the node version to 2.2.12:
    mongoUrl: 'mongodb+srv://admin:Merluza23@cluster0.vuapg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    mongoOptions: advancedOptions
  }),
  /* ----------------------------------------------------- */

  secret: 'shhhhhhhhhhhhhhhhhhhhh',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 600000
  }
}))


passport.use('register', new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
}, async (req, username, password, done) => {

  const { nombre, email} = req.body;
  const usuario = { nombre, username, email, password, contador: 0 };
  const resultado = await miUsuarioDAO.addUsuario(usuario);

  if (!resultado.error) {
    return done(null, usuario)
  } else {
    return done({ error: resultado.error })

  }
}));



passport.use('login', new LocalStrategy({
  usernameField: 'email'
}, async (username, password, done) => {
  if (await miUsuarioDAO.checkPassword(username, password)) {
    const usuario = await miUsuarioDAO.getUsuario(username);
    return done(null, usuario);
  } else {
    return done({ error: 'Usuario o contraseña incorrectos' }, false)
  }
}));


passport.serializeUser(function (user, done) {
  done(null, user.username);
});

passport.deserializeUser(async function (username, done) {
  const usuario = await miUsuarioDAO.getUsuario(username)
  done(null, usuario);
});




app.use(passport.initialize());
app.use(passport.session());



/* --------------------- AUTH --------------------------- */

function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
}
function contarVisitas(req, res, next) {
  if (!req.user.contador) {
    req.user.contador = 0
  }
  req.user.contador++
  next()
}

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

async function GuardarEnArchivo(mensaje) {
  let mensajes = await fs.promises.readFile(nombreArchivo, 'utf8');
  if (mensajes == "") {
    mensajes = [];
  }
  mensajes = JSON.parse(mensajes);
  mensaje.id = mensajes.length + 1;
  mensajes.push(mensaje);
  await fs.promises.writeFile(nombreArchivo, JSON.stringify(mensajes));

}

async function getMensajesNormalizados() {
  let mensajes = await fs.promises.readFile(nombreArchivo, 'utf8');
  mensajes = JSON.parse(mensajes);
  const mensajesNormalizados = normalize(mensajes, listaMensajesSchema);
  return mensajesNormalizados;
}







/* ------------------------------------------------------ */
/* Cargamos las Views con los formularios.  */
app.get('/', isAuth, contarVisitas, async (req, res) => {
  const productitos = await productos();
  console.log(productitos)
  res.render('verProductos.hbs', { productitos, nombreUsuario: req.user.nombre })
})

app.get('/productos', isAuth, contarVisitas, async (req, res) => {
  const productitos = await productos();
  res.render('CargarProductos.hbs', { productitos, nombreUsuario: req.user.nombre })
})

/** TP Mocks y normalización **/
app.get('/ProductosTest', isAuth, contarVisitas, async (req, res) => {
  const productitos = await productosTest();
  res.render('verProductos.hbs', { productitos, nombreUsuario: req.user.nombre })
})




/* Login por Formulario */
app.get('/login', (req, res) => {
  res.render('login.hbs')
})

app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin', successRedirect: '/' }))

app.get('/faillogin', (req, res) => {
  res.render('login.hbs', { error: 'Usuario o contraseña incorrectos' })
})

app.get('/logout', (req, res) => {
  res.render('logout.hbs', { logout: true, nombreUsuario: req.user.nombre })
  req.logout();
})

app.get('/register', (req, res) => {
    res.render('register.hbs');
})

app.post('/register', passport.authenticate('register', { failureRedirect: '/failregister', successRedirect: '/' }))

app.get('/failregister', (req, res) => {
  res.render('register.hbs', { error: "Error al crear cuenta." });
})


/* TP Login por Formulario */
/* Prueba de Session */
app.get('/session', isAuth, contarVisitas, (req, res) => {
  if (req.session.contador) {
    req.session.contador++
    res.send(`Ud ha visitado el sitio ${req.session.contador} veces.`)
  } else {
    req.session.contador = 1
    res.send('Bienvenido!')
  }
})

// DATOS
app.get('/datos', isAuth, contarVisitas, (req, res) => {
  res.render('datos.hbs', {
    username: req.user.username,
    nombreUsuario: req.user.nombre, 
    nombre: req.user.nombre,
    email: req.user.email,
    password: req.user.password,
    contador: req.user.contador
  })
})


/* Iniciamos el servidor en el puerto 8080 */
const PORT = 8080
const server = httpServer.listen(PORT)
server.on('listening', () => {
  console.log(`ya me conecté al puerto ${server.address().port}`)
})
server.on('error', error => { console.log(error) })
