import Carrito from "../../entities/Carrito.js";
import { MongoClient } from 'mongodb'
import { config } from '../../../config.js'


let MongoDB = config.DB_MongoDB;

const client = new MongoClient(MongoDB.uri, { useNewUrlParser: true });

await client.connect();

const Carrito_Collection = client.db(MongoDB.DB).collection(MongoDB.Carrito_Collection);

// Guardar un carrito en el archivo JSON
export const saveCarrito = (carrito) => {
    Carrito_Collection.insertOne(carrito);
}

// Obtener todos los carritos del archivo JSON
export  const getCarritos = async () => {
    let carritosJSON =  await Carrito_Collection.find().toArray();
    let carritos = [];
    carritosJSON.forEach(carrito => {
        carritos.push(new Carrito(carrito.id, carrito.timestamp, carrito.productos));
    });
    return carritos;
}

// Obtener un Carrito por ID del JSON
export const getCarritoById = async (id) => {
    try {
        let carritoJSON = await Carrito_Collection.findOne({ id: parseInt(id) });
        let carrito = new Carrito(carritoJSON.id, carritoJSON.timestamp, carritoJSON.productos);
        return carrito;
    } catch (error) {
        console.log(error);
    }
}


//Obtener ID maximo de los carritos
export const getNextIdCarrito = async () => {

    let carrito = await Carrito_Collection.findOne({}, { sort: { id: -1 } });
    if (carrito) {
        return carrito.id + 1;
    } else {
        return 1;
    }
    
   

}

//Actualizar Carrito
export const updateCarrito = (carrito) => {
    Carrito_Collection.updateOne({ id: carrito.id }, { $set: { productos: carrito.productos } });

}

//Eliminar un producto del JSON
export const deleteCarrito = (id) => {
    Carrito_Collection.deleteOne({ id: parseInt(id) });

    }