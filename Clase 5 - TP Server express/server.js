const express = require('express')
const Contenedor = require('./Contenedor.js')

const conteiner = new Contenedor("productos.txt");

const app = express()

const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => {
   console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))

app.get('/productos', async (req, res) => {
    const productos = await conteiner.getAll();
    res.json(productos);
 })

 app.get('/productoRandom', async (req, res) => {
    const productos = await conteiner.getAll();
    const randomproductos = productos[Math.floor(Math.random() * productos.length)];
    res.json(randomproductos);
 })

