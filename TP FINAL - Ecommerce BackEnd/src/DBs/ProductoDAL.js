import * as ProductoDaoArchivo from "./Archivo/ProductosDaoArchivo.js"
import * as ProductoDaoMongoDB from "./MongoDB/ProductosDaoMongoDB.js"
import * as ProductoFirebase from "./Firebase/ProductosDaoFirebase.js"
import {config } from "../../config.js"


export default class ProductoDAL {

    constructor() {
        switch (config.DB_Type) {
            case "MongoDB": 
                this.dao =  ProductoDaoMongoDB;
                break;
            case "Firebase":
                this.dao =  ProductoFirebase;
                break;
            case "Archivo":
                this.dao =  ProductoDaoArchivo;
                break; 
            default:
                this.dao =  ProductoDaoArchivo;
                break;
        }
    }

    async saveProducto(producto) {
        this.dao.saveProducto(producto);
    }

    async getProductos() {
        return await this.dao.getProductos();
    }

    async getProductoById(id) {
        return await this.dao.getProductoById(id);
    }

    async getNextIdProducto() {
        return await this.dao.getNextIdProducto();
    }

    async getProductosByCodigo(codigo) {
        return await this.dao.getProductosByCodigo(codigo);
    }

    async updateProducto(producto) {
        this.dao.updateProducto(producto);
    }

    async deleteProducto(id) {
        this.dao.deleteProducto(id);
    }

}
