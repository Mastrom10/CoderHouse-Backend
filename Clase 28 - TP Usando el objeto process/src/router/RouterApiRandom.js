const { Router } = require('express');
const routerApiRandom = Router();
const {fork} = require('child_process');


//calcular un cantidad de números aleatorios en el rango del 1 al 1000 especificada por parámetros de consulta (query).
//Por ej: /randoms?cant=20000.
//Si dicho parámetro no se ingresa, calcular 100.000.000 números.

routerApiRandom.get('/', async (req, res) => {
    const { cant } = req.query;
    const computoNumerosRandom = fork('./src/computoNumerosRandom.js');
    computoNumerosRandom.send({cant});
    computoNumerosRandom.on('message', msg => {
        res.json(msg);
    })
});



exports.routerApiRandom = routerApiRandom;
