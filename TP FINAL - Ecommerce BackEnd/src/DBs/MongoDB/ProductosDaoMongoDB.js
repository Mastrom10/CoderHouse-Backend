
import Producto from "../../entities/Producto.js";
import { MongoClient } from 'mongodb'
import { config } from '../../../config.js'


let MongoDB = config.DB_MongoDB;
const client = new MongoClient(MongoDB.uri, { useNewUrlParser: true });

await client.connect();

const Producto_Collection = client.db(MongoDB.DB).collection(MongoDB.Producto_Collection);

export function saveProducto(producto) {
  Producto_Collection.insertOne(producto);
}

export async function getProductos() {
  let productosJSON = await Producto_Collection.find().toArray();
  let productos = [];
  productosJSON.forEach(producto => {
    productos.push(new Producto(producto.nombre, producto.descripcion, producto.codigo, producto.foto, producto.precio, producto.stock, producto.id, producto.timestamp));

  }
  );

  return productos;
}


// Obtener un producto por Id
export async function getProductoById(id) {
  let productoJSON = await Producto_Collection.findOne({ id: parseInt(id)  });
  let producto = new Producto(productoJSON.nombre, productoJSON.descripcion, productoJSON.codigo, productoJSON.foto, productoJSON.precio, productoJSON.stock, productoJSON.id, productoJSON.timestamp);

  return producto;

}

//Obtener ID siguiente de los Productos
export async function getNextIdProducto() {
  let productoJSON = await Producto_Collection.find().sort({ id: -1 }).limit(1).toArray();
  let id = 0;
  productoJSON.forEach(producto => {
    id = producto.id + 1;
  });
  return id;
  
}

// Actualizar un producto del JSON
export function updateProducto(producto) {
  Producto_Collection.updateOne(
    { id: producto.id }, 
    { $set: { nombre: producto.nombre, descripcion: producto.descripcion, codigo: producto.codigo, foto: producto.foto, precio: producto.precio, stock: producto.stock, timestamp: producto.timestamp } }
  );
}

// Eliminar un producto del JSON por Id
export function deleteProducto(id) {
  Producto_Collection.deleteOne({ id: parseInt(id)  });

}



