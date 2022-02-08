const { Router } = require('express');
const routerApiRandom = Router();

//const {fork} = require('child_process');


//calcular un cantidad de números aleatorios en el rango del 1 al 1000 especificada por parámetros de consulta (query).
//Por ej: /randoms?cant=20000.
//Si dicho parámetro no se ingresa, calcular 100.000.000 números.

/* Child process desactivado por TP de Logger gzip profiling.

routerApiRandom.get('/', async (req, res) => {
    const { cant } = req.query;
    const computoNumerosRandom = fork('./src/computoNumerosRandom.js');
    computoNumerosRandom.send({cant});
    computoNumerosRandom.on('message', msg => {
        res.json(msg);
    })
});

*/

routerApiRandom.get('/', async (req, res) => {
    const { cant } = req.query;
    res.json(calcularArray(cant));
});

const calcularArray = (cant) => {
    const cantidad = cant ? parseInt(cant) : 100000000;
    const nums = [];
    //objeto que contendrá como claves los números random generados junto a la cantidad de veces que salió cada uno.
    for (let i = 0; i < cantidad; i++) {
        const num = Math.floor(Math.random() * 1000) + 1;
        if (nums[num]) {
            nums[num]++;
        } else {
            nums[num] = 1;
        }
    }
    let respuesta = {}
    //index son las key, y value son los valores.
    for (let index in nums) {
        respuesta[index] = nums[index];
    }
    return respuesta;
}


exports.routerApiRandom = routerApiRandom;
