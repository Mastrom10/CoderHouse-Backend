/* Dependencias */
import express from 'express';
import routerCarrito from './src/routers/routerCarrito.js';
import routerProductos from './src/routers/routerProductos.js';
import ErrorHandling from './src/Middlewares/ErrorHandling.js';

//servidor express
const app = express();


/* Middlewares */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('src/public'))

/* Routers */
app.use('/api/carrito', routerCarrito)
app.use('/api/productos', routerProductos)
app.use('/*', ErrorHandling)






/* Iniciamos el Servidor */
const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => {
   console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))

