
import { getNextIdCarrito } from "../DBs/CarritoDAL.js";
export default class Carrito {
//constructor estructura: id, timestamp(carrito), producto: [{ id, timestamp(producto), nombre, descripcion, código, foto (url), precio, stock }]

    productos = [];

    constructor(id = getNextIdCarrito(), timestamp = Date.now(), productos = []) {
        this.id = id;
        this.timestamp = timestamp;
        this.productos = productos;
    }

    //agregar Producto
    agregarProducto(producto) {
        this.productos.push(producto);
    }

    //quitar producto
    quitarProducto(producto) {
        this.productos.splice(this.productos.indexOf(producto), 1);
    }

    //calcular total
    calcularTotal() {
        let total = 0;
        this.productos.forEach(producto => {
            total += producto.precio;
        });
        return total;
    }

    //calcular cantidad de productos
    calcularCantidadProductos() {
        return this.productos.length;
    }

    

}