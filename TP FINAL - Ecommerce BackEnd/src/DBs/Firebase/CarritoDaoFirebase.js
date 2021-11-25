import Carrito from "../../entities/Carrito.js";

// import firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore"
import { collection, doc, setDoc, updateDoc, deleteDoc, getDocsFromServer, getDocFromServer} from "firebase/firestore";


//importar la configuracion de firebase
import { ServiceAccount } from "../../../coderhouse-9b562-firebase-adminsdk-6rcmc-c2690938b5.js";


const app = initializeApp(ServiceAccount);

const db = getFirestore();

// Guardar un carrito en el archivo JSON
export const saveCarrito = (carrito) => {
    setDoc(doc(db, "carritos", `${carrito.id}`), {
        id: carrito.id,
        timestamp: carrito.timestamp,
        productos: carrito.productos
        })
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef);
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
}



// Obtener todos los carritos del archivo JSON
export  const getCarritos = async () => {
    const carritosFirestone = await getDocsFromServer(collection(db, "carritos"));
    const carritos = [];
    carritosFirestone.forEach(carrito => {
        carritos.push(new Carrito(carrito.data().id, carrito.data().timestamp, carrito.data().productos));
    });
    return carritos;
}

// Obtener un Carrito por ID del JSON
export const getCarritoById = async (id) => {
    const carritoFirestone = await getDocFromServer(doc(db, "carritos", `${id}`));
    const carrito = new Carrito(carritoFirestone.data().id, carritoFirestone.data().timestamp, carritoFirestone.data().productos);
    return carrito;
}


//Obtener ID maximo de los carritos
export const getNextIdCarrito = async () => {

    const carritosFirestone = await getDocsFromServer(collection(db, "carritos"));
    if (carritosFirestone.length === 0) {
        return 1;
    }
    let maxId = 0;

    carritosFirestone.forEach(carrito => {
        if (carrito.data().id > maxId) {
            maxId = carrito.data().id;
        }
    });
    return maxId + 1;  
}

//Actualizar Carrito
export const updateCarrito = (carrito) => {
    updateDoc(doc(db, "carritos", `${carrito.id}`), {
        id: carrito.id,
        timestamp: carrito.timestamp,
        productos: carrito.productos
    })
    .then(function (docRef) {
        console.log("Document written with ID: ", docRef);
    })
    .catch(function (error) {
        console.error("Error adding document: ", error);
    });
}

//Eliminar un producto del JSON
export const deleteCarrito = (id) => {
    deleteDoc(doc(db, "carritos", `${id}`))
    .then(function (docRef) {
        console.log("Document written with ID: ", docRef);
    })
    .catch(function (error) {
        console.error("Error adding document: ", error);
    });
}
