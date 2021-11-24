
import Producto from "../../entities/Producto.js";
import fs from "fs";

// Guardar un producto en el archivo JSON
export function saveProducto(producto) {
  let productos = getProductos();
  productos.push(producto);
  fs.writeFileSync("./src/DBs/Archivo/productos.json", JSON.stringify(productos));
}

// Obtener todos los productos del archivo JSON
export  function getProductos() {
  let productosJSON = JSON.parse(fs.readFileSync("./src/DBs/Archivo/productos.json"));
    let productos = [];
    productosJSON.forEach(producto => {
        productos.push(new Producto(producto.nombre, producto.descripcion, producto.codigo, producto.foto, producto.precio, producto.stock, producto.id, producto.timestamp));
    });
  return productos;
}

// Obtener un producto por Id
export  function getProductoById(id) {
  let productos =  getProductos();
  let producto = productos.find(p => p.id == id);
  if(producto){
    return new Producto(producto.nombre, producto.descripcion, producto.codigo, producto.foto, producto.precio,producto.stock, producto.id, producto.timestamp);
  } else {
    return null;
  }
  
}

//Obtener ID maximo de los Productos
export function getNextIdProducto() {
  let productos = getProductos();
  let maxId = 0;
  productos.forEach(producto => {
    if (producto.id > maxId) {
      maxId = producto.id;
    }
  });
  return maxId + 1;
}

// Obtener un producto por Codigo
export function getProductosByCodigo(codigo) {
  let productos = getProductos();
  let productosFiltrados = productos.filter(p => p.codigo == codigo);
  return productosFiltrados;
}   

// Actualizar un producto del JSON
export function updateProducto(producto) {
  let productos = getProductos();
  let index = productos.findIndex(p => p.id == producto.id);
  productos[index] = producto;
  fs.writeFileSync("./src/DBs/Archivo/productos.json", JSON.stringify(productos));
}

// Eliminar un producto del JSON por Id
export function deleteProducto(id) {
  let productos = getProductos();
  let index = productos.findIndex(p => p.id == id);
  productos.splice(index, 1);
  fs.writeFileSync("./src/DBs/Archivo/productos.json", JSON.stringify(productos));
}



