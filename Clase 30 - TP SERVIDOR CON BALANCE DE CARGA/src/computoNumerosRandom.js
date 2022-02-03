const { json } = require("express");

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


process.on('exit', () => {
    console.log(`worker #${process.pid} cerrado`)
})

process.on('message', msg => {
    let respuesta = calcularArray(msg.cant);
    process.send(respuesta)
    }
)

