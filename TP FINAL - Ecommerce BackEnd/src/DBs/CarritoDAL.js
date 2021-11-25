
import * as CarritoDaoArchivo from "./Archivo/CarritoDaoArchivo.js"
import * as CarritoDaoMongoDB from "./MongoDB/CarritoDaoMongoDB.js"
import * as CarritoDaoFirebase from "./Firebase/CarritoDaoFirebase.js"
import { config } from '../../config.js'


export default class CarritoDAL {
 
    
    constructor() {
        
        switch (config.DB_Type) {
            case "MongoDB":
                this.dao = CarritoDaoMongoDB;
                break;
            case "Archivo":
                this.dao = CarritoDaoArchivo;
                break;
            case "Firebase":
                this.dao = CarritoDaoFirebase;
                break;
            default:
                this.dao = CarritoDaoArchivo;
                break;
        }
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