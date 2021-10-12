
/**
 * @author Nicolas Mastromarino <nmastromarino@teco.com.ar>
 */

class Usuario{
    
    constructor(nombre, apellido, libros = [], mascotas = []){
        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = libros;
        this.mascotas = mascotas;

    }

    getFullName(){
        //return this.nombre + " " + this.apellido;
        return `${this.nombre} ${this.apellido}`;
    }

    addMascota(mascota){
      this.mascotas.push(mascota);  
    }

    countMascotas(){
       return this.mascotas.length; 
    }

    addBook(nombreLibro, autorLibro){
        this.libros.push({nombre: nombreLibro, autor: autorLibro});
    }

    getBookNames(){
        //return this.libros.map(function(obj){return obj.nombre});
        //return this.libros.map(obj => obj.nombre);
        let a = [];
        this.libros.forEach(element => {
            a.push(element.nombre);
        });
        return a;
    }
}


const usuario = new Usuario("Elon", "Musk", [{nombre: 'El señor de las moscas',autor: 'William Golding'}, {nombre: 'Fundacion', autor: 'Isaac Asimov'}], ['perro', 'gato']);


console.log(usuario.countMascotas());
console.log(usuario.getBookNames());

console.log("Se agrega nombre y mascota:");

usuario.addBook("Harry Potter", "JK Rowling");
usuario.addMascota("Salamandra");

console.log(usuario.countMascotas());
console.log(usuario.getBookNames());
console.log(usuario.getFullName());
