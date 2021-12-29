const { Router } = require('express');
const faker = require('faker');

const routerProductos = Router();


/**
 * Devuelve un array con Todos los Productos presentes en el archivo.
 * @returns {Array} array con Todos los Productos
 */
routerProductos.get('/', async (req, res) => {
    res.json(await getAll());
});


async function getAll() {
    let productos = [];
    for (let i = 0; i < 5; i++) {
        productos.push({
            id: i,
            title: faker.commerce.productName(),
            price: faker.commerce.price(),
            thumbnail: faker.image.imageUrl(100,100,faker.commerce.productAdjective()),
        });
    }

    return productos;
}

exports.routerProductosTest = routerProductos;
exports.productosTest = getAll;
