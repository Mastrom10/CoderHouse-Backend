const options = {
    client: 'sqlite3',
    connection: {filename: "./src/DBs/ecommerce.sqlite"},
    useNullAsDefault: true
}


const knex = require('knex')(options);


//insertarMensaje en DB sqlite3
 function insertarMensaje(mensaje) {
    knex('mensajes').insert(mensaje).then(function (result) {
        console.log(result);
    }).catch(function (err) {
        console.log(err);
    });
}

module.exports.insertarMensaje = insertarMensaje;