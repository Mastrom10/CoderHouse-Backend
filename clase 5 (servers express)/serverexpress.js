const express = require('express')

const app = express()

const PORT = 8080

const server = app.listen(PORT, () => {
   console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))



let ContadorVisitas = 0;
app.get('/', (req, res) => {
    ContadorVisitas++;
    res.send(`<h1> Bienvenidos al servidor express </h1>`)
 })

 app.get('/visitas', (req, res) => {
    ContadorVisitas++;
    res.send(`La cantidad de visitas es ${ContadorVisitas}`)
 })

 app.get('/fyh', (req, res) => {
    ContadorVisitas++;
    const fecha = Date();
    //res.send(`{fyh: '${formatDate(fecha)}'}`)
    res.json({fyh: formatDate(fecha)})
 })

 
 function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hour = d.getHours(),
        minutes = d.getMinutes(),
        secondss = d.getSeconds();

    return `${[day, month, year].join('/')} ${[hour, minutes, secondss].join(':')}`;
}
 