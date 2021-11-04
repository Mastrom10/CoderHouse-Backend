import Router from 'express';
import * as carritoDAL from '../DBs/CarritoDAL.js'
import Carrito from '../entities/Carrito.js';

const routerCarrito = Router();

/* POST: '/' - Crea un carrito y devuelve su id. */
routerCarrito.post('/', (req, res) => {
    let nuevoCarrito = new Carrito();
    carritoDAL.saveCarrito(nuevoCarrito)
    res.json(nuevoCarrito)
});

/* DELETE: '/:id' - Vacía un carrito y lo elimina.*/
routerCarrito.delete('/:id', (req, res) => {
    if (carritoDAL.deleteCarrito(req.params.id)) {
        res.status(200).json({ "status": `Carrito ID ${req.params.id} Eliminado correctamente` })
    } else {
        res.status(404).json({ "status": `Carrito ID ${req.params.id} No existe` })
    }
});
/* GET : '/' - Devuelve todos los carritos */
routerCarrito.get('/', (req, res) => {
    let carritos = carritoDAL.getCarritos();
    if (carritos.length > 0) {
        res.json(carritos);
    } else {
        res.status(404).json({ "status": "No hay carritos" })
    }
});


/* GET : '/:id' - Devuelve el carrito con el id pasado por parámetro. */
routerCarrito.get('/:id', (req, res) => {
    let carrito = carritoDAL.getCarritoById(req.params.id);
    if (carrito) {
        res.json(carrito)
    } else {
        res.status(404).json({ "status": `Carrito ID ${req.params.id} No existe` })
    }
});


/* GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito */
routerCarrito.get('/:id/productos', (req, res) => {
    let carrito = carritoDAL.getCarritoById(req.params.id)
    if (carrito) {
        res.json(carrito.productos)
    } else {
        res.status(404).json({ "status": `Carrito ID ${req.params.id} No existe` })
    }
});

/* POST: '/:id/productos' - Para incorporar productos al carrito por su id de producto */
routerCarrito.post('/:id/productos', (req, res) => {
    let carrito = carritoDAL.getCarritoById(req.params.id)
    let producto = req.body
    carrito.productos.push(producto)
    carritoDAL.saveCarrito(carrito)
    res.json(carrito)
});

/* DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto */
routerCarrito.delete('/:id/productos/:id_prod', (req, res) => {
    let carrito = carritoDAL.getCarritoById(req.params.id)
    carrito.quitarProducto(req.params.id_prod)
    carritoDAL.saveCarrito(carrito)
    res.json(carrito)
});

export default routerCarrito;