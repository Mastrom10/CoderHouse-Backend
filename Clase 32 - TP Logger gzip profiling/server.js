const express = require('express')
const exphbs = require('express-handlebars')
require('dotenv').config()
const yargs = require('yargs/yargs')(process.argv.slice(2))

const numCPUs = require('os').cpus().length

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

/* TP Compression */
const compression = require('compression')
/* TP Logger */
const logger = require('./logger')
logger.info('Logger Iniciado correctamente Nivel: info')
logger.warn('Logger Iniciado correctamente Nivel: warn')
logger.error('Logger Iniciado correctamente Nivel: error')



const app = express()
const httpServer = new HttpServer(app)
const srvSocket = new IOServer(httpServer)

const { productos, routerProductos } = require("./src/router/RouterProductos")

const { productosTest, routerProductosTest } = require("./src/router/RouterProductosTest")

const { routerApiRandom } = require("./src/router/RouterApiRandom")

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
app.use('/api/randoms', routerApiRandom)
app.use(express.static('src/public'))



/* TP Logger */
const logAllRequest = (req, res, next) => {
  logger.info(`${req.method} ${req.url}`)
  next()
}
app.use(logAllRequest)
/* TP Logger */


/* TP Login por Formulario */
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
app.use(session({
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
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

  const { nombre, email } = req.body;
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
const nombreArchivo = process.env.ARCHIVO_MENSAJES_CHAT;

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





/* TP Profiler */
const GenerarInfo = (req, res, next) => {
    req.infoDelUsuario = {
      //Argumentos de entrada
      argumentos: process.argv,
      //Nombre de la plataforma (sistema operativo) 
      plataforma: process.platform,
      //Versión de node.js          
      versionNode: process.version,
      //Memoria total reservada (rss)
      memoriaTotal: process.memoryUsage().rss,
      //Path de ejecución
      pathEjecucion: process.execPath,
      //Process id
      pid: process.pid,
      //Carpeta del proyecto
      carpetaProyecto: __dirname,
      nombreUsuario: req.user ? req.user.nombre : 'Anonimo',
      cantidadProcesadores: numCPUs
    }
    next()
  }

const mostrarInfo = (req, res) => {

    res.render('info.hbs', req.infoDelUsuario)
  }

const loguearInfoUsuario = (req, res, next) => {
  logger.info(req.infoDelUsuario)
  next()
}

  
app.get('/info', isAuth, contarVisitas, GenerarInfo, mostrarInfo)
app.get('/infoLog', isAuth, contarVisitas, GenerarInfo, loguearInfoUsuario, mostrarInfo)
  

//artillery quick -c 50 -n 20 "http://localhost:8080/NoAuthinfo" > artillery_NoAuthinfo.txt
app.get('/NoAuthinfo', GenerarInfo, mostrarInfo)

//artillery quick -c 50 -n 20 "http://localhost:8080/NoAuthinfoLog" > artillery_NoAuthinfoLog.txt
app.get('/NoAuthinfoLog', GenerarInfo, loguearInfoUsuario, mostrarInfo)
/* TP Logger Gzip */

app.get('/infogzip', isAuth, contarVisitas, compression(),GenerarInfo, mostrarInfo)


















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




//TP LOGUEO - Not found handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  logger.warn(`${err.status} - ${req.originalUrl} - ${req.ip}`);
  next(err);
});

//TP LOGUEO - error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error.hbs', {
    message: err.message,
    error: err
  });
});



/* TP Usando el objeto process */
const { puerto, modo, _ } = yargs
  .alias({ p: 'puerto', m: 'modo' })
  .default({ puerto: 8080, modo: 'FORK' })
  .argv;


/* TP SERVIDOR CON BALANCEO */
const cluster = require('cluster')
const { exit } = require('process')



if (modo.toUpperCase() === 'FORK') {
  iniciarServer();
} else if (modo.toUpperCase() === 'CLUSTER') {
  if (cluster.isMaster) {
    console.log(`Master Server is running, PID Server: ${process.pid} `);
    console.log(`Master is running with ${numCPUs} CPUs`);
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork()
    }

    cluster.on('exit', worker => {
      console.log(
        'Worker',
        worker.process.pid,
        'died',
        new Date().toLocaleString()
      )
      cluster.fork()
    })
  } else {
    iniciarServer()
  }
} else {
  console.log(`Modo ${modo} no soportado`);
  exit(1)
}



function iniciarServer() {
  /* Iniciamos el servidor en el puerto 8080 */
  const server = httpServer.listen(puerto, error => {
    if (error) {
      console.log(error)
    } else {
    logger.trace(`Servidor express escuchando en el puerto ${puerto} - PID Server: ${process.pid}`)
    }
  }
  )

  server.on('listening', () => {
    //console.log(`ya me conecté al puerto ${server.address().port}`)
  })

  server.on('error', error => { console.log(error) })
}


