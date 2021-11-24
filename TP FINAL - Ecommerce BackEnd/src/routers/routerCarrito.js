import Router from 'express';
import CarritoDAL from '../DBs/CarritoDAL.js'
import Carrito from '../entities/Carrito.js';

const routerCarrito = Router();


const carritoDAL = new CarritoDAL();

/* POST: '/' - Crea un carrito y devuelve su id. */
routerCarrito.post('/', async (req, res) => {
    let nuevoCarrito = new Carrito(await carritoDAL.getNextIdCarrito());
    carritoDAL.saveCarrito(nuevoCarrito)
    res.json(nuevoCarrito)
});

/* DELETE: '/:id' - Vacía un carrito y lo elimina.*/
routerCarrito.delete('/:id', async (req, res) => {
    if (await carritoDAL.deleteCarrito(req.params.id)) {
        res.status(200).json({ "status": `Carrito ID ${req.params.id} Eliminado correctamente` })
    } else {
        res.status(404).json({ "status": `Carrito ID ${req.params.id} No existe` })
    }
});
/* GET : '/' - Devuelve todos los carritos */
routerCarrito.get('/', async (req, res) => {
    let carritos = await carritoDAL.getCarritos();
    if (carritos.length > 0) {
        res.json(carritos);
    } else {
        res.status(404).json({ "status": "No hay carritos" })
    }
});


/* GET : '/:id' - Devuelve el carrito con el id pasado por parámetro. */
routerCarrito.get('/:id', async (req, res) => {
    let carrito = await carritoDAL.getCarritoById(req.params.id);
    if (carrito) {
        res.json(carrito)
    } else {
        res.status(404).json({ "status": `Carrito ID ${req.params.id} No existe` })
    }
});


/* GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito */
routerCarrito.get('/:id/productos', async (req, res) => {
    let carrito = await carritoDAL.getCarritoById(req.params.id)
    if (carrito) {
        res.json(carrito.productos)
    } else {
        res.status(404).json({ "status": `Carrito ID ${req.params.id} No existe` })
    }
});

/* POST: '/:id/productos' - Para incorporar productos al carrito por su id de producto */
routerCarrito.post('/:id/productos', async (req, res) => {
    let carrito = await carritoDAL.getCarritoById(req.params.id)
    let producto = req.body
    carrito.productos.push(producto)
    await carritoDAL.updateCarrito(carrito)
    res.json(carrito)
});

/* DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto */
routerCarrito.delete('/:id/productos/:id_prod', async (req, res) => {
    let carrito = await carritoDAL.getCarritoById(req.params.id)
    carrito.quitarProducto(req.params.id_prod)
    await carritoDAL.updateCarrito(carrito)
    res.json(carrito)
});

export default routerCarrito;