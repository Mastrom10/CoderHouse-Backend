const fs = require('fs');


class Contenedor{

    /**
    * @param {string} nombreArchivo  nombre del arhivo a guardar.
    */
    constructor(nombreArchivo){
        this.nombreArchivo = nombreArchivo;
    }

    /**
     * Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
     */
    async save(object){
        let objetos = []
        try{
            objetos = await this.getAll();
            let max = 0;
            objetos.forEach(producto => {
                if (producto.id > max) {
                    max = producto.id;
                  }
            });
            object.id = max+1; 
        } catch{
            object.id = 1;
        }
        objetos.push(object);
        const objetoEnJson = JSON.stringify(objetos);
        await fs.promises.writeFile(this.nombreArchivo, objetoEnJson)
    }

     /**
     * Recibe un id y devuelve el objeto con ese id, o null si no está.
     */
    async getById(id){
        let objetos = await this.getAll();
        const objetoxID = objetos.find(producto => producto.id == id)
        return objetoxID ? objetoxID : null;

    }
    
    /**
     * Devuelve un array con los objetos presentes en el archivo.
     * @returns {Array}
     */
    async getAll(){
        const json = await fs.promises.readFile(this.nombreArchivo);
        const objeto = JSON.parse(json);
        return objeto
    }


     /**
     * Elimina del archivo el objeto con el id buscado.
     */
    async deleteById(id){
        let objetos = await this.getAll();
        objetos = objetos.filter(producto => producto.id !== id)
        await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(objetos));
    }


     /**
     * Elimina todos los objetos presentes en el archivo.
     */
    async deleteAll(){
        await fs.promises.writeFile(this.nombreArchivo, JSON.stringify([]));
    }


}

module.exports = Contenedor