

export const config = {
    //Archivo, MongoDB, Firebase
    DB_Type : 'Firebase',
    DB_Archivo : {
        Carrito_Json_Path: './src/DBs/Archivo/carrito.json',
        Producto_Json_Path: './src/DBs/Archivo/producto.json'
    },
    DB_MongoDB : {
        uri : "mongodb://localhost:27017/ecommerce",
        DB : 'ecommerce',
        Carrito_Collection: 'Carrito',
        Producto_Collection: 'Producto'
    },
    DB_Firebase : {
        databaseURL: "https://ecommerce-6dfbf.firebaseio.com"
    }
}
