
export default class Producto {

    constructor(nombre, descripcion, codigo, foto, precio,stock = 0, id = 0, timestamp = Date.now()) {
        this.id = id;
        this.timestamp = timestamp;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.codigo = codigo;
        this.foto = foto;
        this.precio = precio;
        this.stock = stock;
    }

    
}