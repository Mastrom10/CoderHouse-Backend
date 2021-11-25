
import Producto from "../../entities/Producto.js";

// import firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore"
import { collection, doc, setDoc, updateDoc, deleteDoc, getDocsFromServer, getDocFromServer} from "firebase/firestore";


//importar la configuracion de firebase
import { ServiceAccount } from "../../../coderhouse-9b562-firebase-adminsdk-6rcmc-c2690938b5.js";


const app = initializeApp(ServiceAccount);

const db = getFirestore();


export function saveProducto(producto) {
  setDoc(doc(db, "productos", `${producto.id}`), {
    id: producto.id,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    codigo: producto.codigo,
    foto: producto.foto,
    precio: producto.precio,
    stock: producto.stock,
    timestamp: producto.timestamp,
    id: producto.id
  })
  .then(function (docRef) {
    console.log("Document written with ID: ", docRef);
  })
  .catch(function (error) {
    console.error("Error adding document: ", error);
  });


}

export async function getProductos() {

  const productosFirestone = await getDocsFromServer(collection(db, "productos"));
  const productos = [];
  productosFirestone.forEach(producto => {
    productos.push(new Producto(producto.data().nombre, producto.data().descripcion, producto.data().codigo, producto.data().foto, producto.data().precio, producto.data().stock, producto.data().id, producto.data().timestamp));
  });
  return productos;
}


// Obtener un producto por Id
export async function getProductoById(id) {
  const productoFirestone = await getDocFromServer(doc(db, "productos", `${id}`));
  const producto = new Producto(productoFirestone.data().nombre, productoFirestone.data().descripcion, productoFirestone.data().codigo, productoFirestone.data().foto, productoFirestone.data().precio, productoFirestone.data().stock, productoFirestone.data().id, productoFirestone.data().timestamp);
  return producto;

}

//Obtener ID siguiente de los Productos
export async function getNextIdProducto() {
  const productos = await getProductos();
  if (productos.length == 0) {
    return 1;
  }
  let id = 0;
  productos.forEach(producto => {
    if (producto.id > id) {
      id = producto.id;
    }
  });
  return id + 1;

}

// Actualizar un producto en firebase
export function updateProducto(producto) {
  updateDoc(doc(db, "productos", `${producto.id}`), {
    id: producto.id,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    codigo: producto.codigo,
    foto: producto.foto,
    precio: producto.precio,
    stock: producto.stock,
    timestamp: producto.timestamp,
    id: producto.id
  })
  .then(function (docRef) {
    console.log("Document written with ID: ", docRef);
  })
  .catch(function (error) {
    console.error("Error adding document: ", error);
  }
  );


}

// Eliminar un producto del JSON por Id
export function deleteProducto(id) {
  deleteDoc(doc(db, "productos", `${id}`)).then(function () {
    console.log("Document successfully deleted!");
  }
  ).catch(function (error) {
    console.error("Error removing document: ", error);
  }
  );

}



