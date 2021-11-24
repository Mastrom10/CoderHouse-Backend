
import fs from 'fs';
import Carrito from "../../entities/Carrito.js";

// Guardar un carrito en el archivo JSON
export const saveCarrito = (carrito) => {
    let carritos = getCarritos();
    carritos = QuitarCarrito(carritos, carrito.id);
    carritos.push(carrito);
    fs.writeFileSync('./src/DBs/Archivo/carrito.json', JSON.stringify(carritos));
}

// Obtener todos los carritos del archivo JSON
export const getCarritos = () => {
    let carritosJson = JSON.parse(fs.readFileSync('./src/DBs/Archivo/carrito.json').toString());
    let carritos = [];
    carritosJson.forEach(carrito => {
        carritos.push(new Carrito(carrito.id, carrito.timestamp, carrito.productos));
    });
    return carritos;
}

// Obtener un Carrito por ID del JSON
export const getCarritoById = (id) => {
    let carritos = getCarritos();
    let carrito = carritos.find(carrito => carrito.id == id);
    if (carrito) {
        return new Carrito(carrito.id, carrito.timestamp, carrito.productos);
    } else {
        return null;
    }
}

//Obtener ID maximo de los carritos
export const getNextIdCarrito = () => {
    try {
        let carritos = getCarritos();
        let maxId = 0;
        carritos.forEach(carrito => {
            if (carrito.id > maxId) {
                maxId = carrito.id;
            }
        });
        return maxId + 1;
    } catch (error) {
        return 1;
    }

}

//Actualizar Carrito
export const updateCarrito = (carrito) => {
    let carritos = getCarritos();
    let index = carritos.findIndex(x => x.id == carrito.id);
    if (index != -1) {
        carritos[index] = carrito;
        fs.writeFileSync('./src/DBs/Archivo/carrito.json', JSON.stringify(carritos));
        return true;
    } else {
        return false;
    }

}

//Eliminar un producto del JSON
export const deleteCarrito = (id) => {
    let carritos = getCarritos();
    let index = carritos.findIndex(x => x.id == id);
    if (index != -1) {
        carritos.splice(index, 1);
        fs.writeFileSync('./src/DBs/Archivo/carrito.json', JSON.stringify(carritos));
        return true
    } else {
        return false
    }
}

const QuitarCarrito = (carritos, id) => {
    let index = carritos.findIndex(x => x.id == id);
    if (index != -1) {
        carritos.splice(index, 1);
        return carritos
    } else {
        return carritos
    }
}

