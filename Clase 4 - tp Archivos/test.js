const Contenedor = require('./Contenedor.js')

const conteiner = new Contenedor("productos.txt");


const producto1 =   {
    title: 'Auriculares',
    price: 42,
    thumbnail: 'http://auris.com'
};
const producto2 =   {
    title: 'Teclado',
    price: 52,
    thumbnail: 'http://teclado.com'
};
const producto3 =   {
    title: 'Monitor',
    price: 100,
    thumbnail: 'http://Monitor.com'
};

async function main(){

    console.log("Se inicia la carga de productos")

    await conteiner.save(producto1);
    await conteiner.save(producto2);
    await conteiner.save(producto3);

    console.log("Carga realizada con exito. Objetos en el archivo: ")  

    let  archivo  = await conteiner.getAll();
    console.log(archivo)  

    console.log("Realizamos la busqueda del producto con ID 2: ")  

    const productoId2 = await conteiner.getById(2);
    console.log(productoId2)

    console.log("Eliminamos el Producto ID 1:")  

    await conteiner.deleteById(1)
    console.log("ELIMINACION EXITOSA, volvemos a verificar el contenido dle archivo:")  
    
    archivo  = await conteiner.getAll();
    console.log(archivo)  
    
    console.log("FINALMENTE borramos todo el archivo.")  
    await conteiner.deleteAll()

    console.log("ELIMINACION EXITOSA, volvemos a verificar el contenido dle archivo:")  
    
    archivo  = await conteiner.getAll();
    console.log(archivo)  

}

main();
