const { Router } = require('express');
const productosDAO = require('./ProductosDAO.js');

const routerProductos = Router();

/**
 * Devuelve un array con Todos los Productos presentes en el archivo.
 * @returns {Array} array con Todos los Productos
 */
routerProductos.get('/', async (req, res) => {
    res.json(await productosDAO.getProductos());
});


/**
 * Devuelve un Objeto con el Producto Segun el ID.
 * @returns {Object} Producto Segun el ID
 */
routerProductos.get('/:id', async (req, res) => {
    idConsulta = parseInt(req.params.id)

    if (isNaN(idConsulta)) {
        return res.send({ error: 'El parámetro ingresado no es un número' })
    } else {
        let ProductoEncontrado = await productosDAO.getProductos().find(producto => { if (producto.id == idConsulta) { return true } })
        return ProductoEncontrado ? res.json(ProductoEncontrado) : res.send({ error: `No se encontro ningun Producto con el id ${idConsulta}` });
    }


});

/**
 * recibe y agrega un producto, y lo devuelve con su id asignado.
 * @returns {Object} Producto con el ID asignado
 */
routerProductos.post('/', async (req, res) => {
    const unProducto = req.body;

    productosDAO.saveProducto(unProducto)
        .then(() => res.redirect('/'))
        .catch(error => res.json({ error }))

});

/**
 * recibe y actualiza un producto según su id.
 * @returns {Object} producto Actualizado según su id
 */
routerProductos.put('/:id', async (req, res) => {
    
    idConsulta = parseInt(req.params.id)
    if (isNaN(idConsulta)) {
        return res.send({ error: 'El parámetro ingresado no es un número' })
    }

    const unProducto = req.body;
    unProducto.id = idConsulta;

    productosDAO.updateProducto(unProducto)
        .then(() => res.json(unProducto))
        .catch(error => res.json({ error }))

});

/**
 * elimina un producto según su id.
 * @returns {boolean} True si el producto fue eliminado con exito. 
 */
routerProductos.delete('/:id', async (req, res) => {
    idConsulta = parseInt(req.params.id)
    if (isNaN(idConsulta)) {
        return res.send({ error: 'El parámetro ingresado no es un número' })
    }

    productosDAO.deleteProducto(idConsulta)
        .then((rows) => res.json({ resultado: true, ClienteEliminado: rows }))
        .catch(error => res.json({ error }))
});


async function getAll() {
    return await productosDAO.getProductos();
}

exports.routerProductos = routerProductos;
exports.productos = getAll;
