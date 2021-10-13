const { Router } = require('express');
const fs = require('fs');

const routerProductos = Router();

const nombreArchivo = 'src/DBs/productos.json';

let productos = [];
getAll().then(objeto => productos = objeto).catch(console.log);


/**
 * Devuelve un array con Todos los Productos presentes en el archivo.
 * @returns {Array} array con Todos los Productos
 */
routerProductos.get('/', (req, res) => {
    res.json(productos);
});


/**
 * Devuelve un Objeto con el Producto Segun el ID.
 * @returns {Object} Producto Segun el ID
 */
routerProductos.get('/:id', (req, res) => {
    idConsulta = parseInt(req.params.id)

    if (isNaN(idConsulta)) {
        return res.send({ error: 'El parámetro ingresado no es un número' })
    } else {
        let ProductoEncontrado = productos.find(producto => { if (producto.id == idConsulta) { return true } })
        return ProductoEncontrado ? res.json(ProductoEncontrado) : res.send({ error: `No se encontro ningun Producto con el id ${idConsulta}` });
    }


});

/**
 * recibe y agrega un producto, y lo devuelve con su id asignado.
 * @returns {Object} Producto con el ID asignado
 */
routerProductos.post('/', async (req, res) => {
    const unProducto = req.body;

    try {
        let max = 0;
        productos.forEach(producto => {
            if (producto.id > max) {
                max = producto.id;
            }
        });
        unProducto.id = max + 1;
    } catch {
        unProducto.id = 1;
    }
    productos.push(unProducto);

    const ProductosEnJson = JSON.stringify(productos);
    await fs.promises.writeFile(nombreArchivo, ProductosEnJson)
    .then(() => res.json(unProducto))
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
    productoEncontrado = productos.find((producto, index) => {
        if (producto.id == unProducto.id){
            productos.splice(index, 1);
            return true;
        }
    })
    if (productoEncontrado){
        productos.push(unProducto);
        const ProductosEnJson = JSON.stringify(productos);
        await fs.promises.writeFile(nombreArchivo, ProductosEnJson)
        .then(() =>  res.json(unProducto))
        .catch(error => res.json({ error }))
    }

   ;

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

    productoEliminado = productos.find((producto, index) => {
        if (producto.id == idConsulta){
            productos.splice(index, 1);
            return true;
        }
    });

    if (productoEliminado){
        const ProductosEnJson = JSON.stringify(productos);
        await fs.promises.writeFile(nombreArchivo, ProductosEnJson)
        .then(() => res.json({resultado: true, ClienteEliminado: productoEliminado}))
        .catch(error => res.json({ error }))
    }
    

});


async function getAll() {
    const json = await fs.promises.readFile(nombreArchivo);
    const objeto = JSON.parse(json);
    return objeto
}

exports.routerProductos = routerProductos;