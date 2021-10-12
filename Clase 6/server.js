const express = require('express')

const app = express()

const PORT = 8080

const server = app.listen(PORT, () => {
   console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))


const frase = 'Hola mundo como están';


app.get('/api/frase', async (req, res) => {
    res.json({frase});
 })

 app.get('/api/letras/:num', async (req, res) => {
     let posicion = parseInt(req.params.num) + 1 ;
     console.log(typeof posicion);
     if (typeof posicion === 'number' && posicion > 0 && posicion < frase.length){
         res.send(frase.charAt(posicion));
     }
     else {
        res.json({error:'numero de letra Inexistente.'});
     }
    
 })

 
 app.get('/api/palabras/:num', async (req, res) => {
    let posicion = parseInt(req.params.num) + 1 ;
    console.log(typeof posicion);
    const arrayPalabras = frase.split(' ');

    if (typeof posicion === 'number' && posicion > 0 && posicion < arrayPalabras.length + 1){
        res.json({palabra: arrayPalabras[posicion - 1] });
    }
    else {
       res.json({error:'numero de palabra Inexistente.'});
    }
   
})
