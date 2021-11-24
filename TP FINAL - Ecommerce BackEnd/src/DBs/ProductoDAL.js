import * as ProductoDaoArchivo from "./Archivo/ProductosDaoArchivo.js"
import * as ProductoDaoMongoDB from "./MongoDB/ProductosDaoMongoDB.js"

export default class ProductoDAL {

    constructor() {
        this.dao = ProductoDaoMongoDB;
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
