const { options } = require('../config/mariadb.js')
const knex = require('knex')(options)

// get
async function getProductos(){
   let productos = []
    let rows = await knex.from('productos').select('*')
    rows.forEach(function(row){
        productos.push(row)
    }
    )
    return productos
}

// get by id
async function getProductoById(id){
    let producto = {}
    let rows = await knex.from('productos').select('*').where('id', id)
    rows.forEach(function(row){
        producto = {title: row.title, price: row.price, thumbnail: row.thumbnail, id: row.id}
    })
    return producto
}

// Calcular ID siguiente y guardar.
async function saveProducto(producto){
    let id = await getNextID()
    let rows = await knex.from('productos').insert({title: producto.title, price: producto.price, thumbnail: producto.thumbnail, id: id})
    return id
}

async function getNextID(){
    let id = await knex.from('productos').max('id as id')
    return id[0].id +1
}

// Actualizar Producto
async function updateProducto(producto){
    let rows = await knex.from('productos').update({title: producto.title, price: producto.price, thumbnail: producto.thumbnail}).where('id', producto.id)
    return rows
}

async function deleteProducto(id){
    let rows = await knex.from('productos').del().where('id', id)
    return rows
}

module.exports.getProductos = getProductos
module.exports.getProductoById = getProductoById
module.exports.saveProducto = saveProducto
module.exports.updateProducto = updateProducto
module.exports.deleteProducto = deleteProducto
