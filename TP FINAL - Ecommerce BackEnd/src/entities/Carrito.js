export default class Carrito {
//constructor estructura: id, timestamp(carrito), producto: [{ id, timestamp(producto), nombre, descripcion, código, foto (url), precio, stock }]

    productos = [];

    constructor(id = 0, timestamp = Date.now(), productos = []) {
        this.id = id;
        this.timestamp = timestamp;
        this.productos = productos;
    }

    //agregar Producto
    agregarProducto(producto) {
        this.productos.push(producto);
    }

    //quitar producto
    quitarProducto(productoID) {
        //encontrar Index
        const index = this.productos.findIndex(producto => producto.id == productoID);
        this.productos.splice(index, 1);
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