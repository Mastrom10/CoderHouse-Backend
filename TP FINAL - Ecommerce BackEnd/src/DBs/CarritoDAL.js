
import * as CarritoDaoArchivo from "./Archivo/CarritoDaoArchivo.js"
import * as CarritoDaoMongoDB from "./MongoDB/CarritoDaoMongoDB.js"


export default class CarritoDAL {
 
    
    constructor() {
        this.dao = CarritoDaoMongoDB;
    }

    async saveCarrito(carrito) {
        this.dao.saveCarrito(carrito);
    }

    async getCarritos() {
        return await this.dao.getCarritos();
    }

    async getCarritoById(id) {
        return await this.dao.getCarritoById(id);
    }

    async getNextIdCarrito() {
        return await this.dao.getNextIdCarrito();
    }


    async updateCarrito(carrito) {
        this.dao.updateCarrito(carrito);
    }


    async deleteCarrito(id) {
        return await this.dao.deleteCarrito(id);
    }

    async QuitarCarrito(carritos, id) {
        return await this.dao.QuitarCarrito(carritos, id);
    }



}