import Router from 'express';
import Producto from '../entities/Producto.js';
import * as productoDAL from '../DBs/ProductoDAL.js'
import OnlyAdminsPrivilege from '../Middlewares/Autorizacion.js'

const routerProductos = Router();

/* Usuarios y admins | Me permite listar todos los productos disponibles ó un producto por su id*/
routerProductos.get('/:id?', (req, res) => {
    let id = req.params.id;
    if (id) {
        let producto = productoDAL.getProductoById(id)
        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ "error": "Producto no encontrado" });
        }
    } else {
        let productos = productoDAL.getProductos()
        res.json(productos);
    }
});




/* incorporar productos al listado (disponible para administradores) */
routerProductos.post('/', OnlyAdminsPrivilege, (req, res) => {
    try {
        if (req.body.nombre && req.body.precio && req.body.descripcion && req.body.codigo && req.body.foto) {
        let producto = new Producto(req.body.nombre, req.body.descripcion, req.body.codigo, req.body.foto, req.body.precio, req.body.stock);
        productoDAL.saveProducto(producto)
        res.status(200).json(producto)
        } else {
            res.status(400).json({ "error": "Faltan datos" });
        }
    } catch (error) {
        res.status(500).json(
            {
                error:
                    `Datos Invalidos. Por favor revise la estructura del Producto
                    ${error.message}`
            }
        )
    }
});

/* Actualiza un producto por su id (disponible para administradores) */
routerProductos.put('/:id', OnlyAdminsPrivilege, (req, res) => {
    let id = req.params.id;
    let producto = productoDAL.getProductoById(id);
    if (producto) {
        producto.nombre = req.body.nombre;
        producto.descripcion = req.body.descripcion;
        producto.codigo = req.body.codigo;
        producto.foto = req.body.foto;
        producto.precio = req.body.precio;
        producto.stock = req.body.stock;
        productoDAL.updateProducto(producto)
        res.status(200).json(producto)
    } else {
        res.status(404).json({ 'error': 'No se encontró el producto' });
    }

});

/*Borra un producto por su id (disponible para administradores) */
routerProductos.delete('/:id', OnlyAdminsPrivilege, (req, res) => {
    let id = req.params.id;
    let producto = productoDAL.getProductoById(id);
    if (producto) {
        productoDAL.deleteProducto(id)
        res.status(200).json({ 'status': `producto ${id} Eliminado con exito` })
    } else {
        res.status(404).json({ 'error': 'No se encontró el producto' });
    }
});




export default routerProductos;