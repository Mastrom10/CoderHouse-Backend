// express server
const express = require('express');
const app = express();

const nombres = [ 'Luis', 'Lucia', 'Miguel', 'juan', 'romeo'];
//array de apellidos
const apellidos = [ 'Lopez', 'Gonzalez', 'Murphi', 'Gonzalez', 'Rowson'];
//arry de colores
const colores = [ 'rojo', 'azul', 'verde', 'amarillo', 'naranja'];

//funcion elegir aleatoriamente un elemento de un array
const elegir = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

//crear combinacion al azar
const crearCombinacion = () => {
    return {
        nombre: elegir(nombres),
        apellido: elegir(apellidos),
        color: elegir(colores)
    }
}

//get 'TEST' devuelve 10 objetos generados aleatoriamente
app.get('/test', (req, res) => {
    const combinaciones = [];
    for(let i = 0; i < 10; i++) {
        combinaciones.push(crearCombinacion());
    }
    res.send(combinaciones);
}
);

//lisen puerto 8080 iniciar server
app.listen(8080, () => {
    console.log('Servidor iniciado en el puerto 8080');
}
);

//on error
app.on('error', (error) => {
    console.error(error);
}
);

