import mongoose from 'mongoose';
import * as model from './models/estudiantes.js';



const losEstudiantes = [
    { nombre: 'Pedro', apellido: 'Mei', edad: 21, dni: '31155898', curso: '1A', nota: 7 },
    { nombre: 'Ana', apellido: 'Gonzalez', edad: 32, dni: '27651878', curso: '1A', nota: 8 },
    { nombre: 'José', apellido: 'Picos', edad: 29, dni: '34554398', curso: '2A', nota: 6 },
    { nombre: 'Lucas', apellido: 'Blanco', edad: 22, dni: '30355874', curso: '3A', nota: 10 },
    { nombre: 'María', apellido: 'García', edad: 36, dni: '29575148', curso: '1A', nota: 9 },
    { nombre: 'Federico', apellido: 'Perez', edad: 41, dni: '320118321', curso: '2A', nota: 5 },
    { nombre: 'Tomas', apellido: 'Sierra', edad: 19, dni: '38654790', curso: '2B', nota: 4 },
    { nombre: 'Carlos', apellido: 'Fernández', edad: 33, dni: '26935670', curso: '3B', nota: 2 },
    { nombre: 'Fabio', apellido: 'Pieres', edad: 39, dni: '4315388', curso: '1B', nota: 9 },
    { nombre: 'Daniel', apellido: 'Gallo', edad: 25, dni: '37923460', curso: '3B', nota: 2 }
];



async function CRUD() {

    try {
        const url = 'mongodb://localhost:27017/Colegio';
        let rta = await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Conectado a la base de datos');


    } catch (error) {
        console.log(error);
    }

losEstudiantes.forEach(unEstudiante => {
   // crearEstudiante(unEstudiante);
    
});



}

/* CREAR Estudiante */
async function crearEstudiante(unEstudiante) {
    try {
        let estudiante = new model.Estudiantes(unEstudiante);
        let rta = await estudiante.save();
        console.log(rta);
    } catch (error) {
        console.log(error);
    }
}


await CRUD();

console.log('CONSULTAS')
// Los estudiantes ordenados por orden alfabético según sus nombres.
console.log('1. Los estudiantes ordenados por orden alfabético según sus nombres');
console.log(await model.Estudiantes.find().sort({ nombre: 1 }));

//El estudiante más joven.
console.log('2. El estudiante más joven');
console.log(await model.Estudiantes.find().sort({ edad: 1 }).limit(1));

// Los estudiantes que pertenezcan al curso '2A'.
console.log('3. Los estudiantes que pertenezcan al curso 2A');
console.log(await model.Estudiantes.find({ curso: '2A' }));

// El segundo estudiante más joven.
console.log('4. El segundo estudiante más joven');
console.log(await model.Estudiantes.find().sort({ edad: 1 }).skip(1).limit(1));

// Sólo los nombres y apellidos de los estudiantes con su curso correspondiente, ordenados por apellido descendente (z a a).
console.log('5. Sólo los nombres y apellidos de los estudiantes con su curso correspondiente, ordenados por apellido descendente (z a a)');
console.log(await model.Estudiantes.find().select({ nombre: 1, apellido: 1, curso: 1 }).sort({ apellido: -1 }));

// Los estudiantes que sacaron 10.
console.log('6. Los estudiantes que sacaron 10');
console.log(await model.Estudiantes.find({ nota: 10 }));


// //calcular promedio de notas de todos los estudiantes
// console.log('7. Calcular promedio de notas de todos los estudiantes');
// let promedio = await model.Estudiantes.find().select({ nota: 1 }).sort({ nota: 1 }).reduce((acc, cur) => {
//     return acc + cur.nota;
// }, 0);
// promedio = promedio / await model.Estudiantes.find().count();
// console.log(promedio);
// 
// // El promedio de notas del curso '1A'.
// console.log('8. El promedio de notas del curso 1A');
// let promedio1A = await model.Estudiantes.find({ curso: '1A' }).select({ nota: 1 }).sort({ nota: 1 }).reduce((acc, cur) => {
//     return acc + cur.nota;
// }, 0);
// promedio1A = promedio1A / await model.Estudiantes.find({ curso: '1A' }).count();
// console.log(promedio1A);



// Actualizar el dni del estudiante Lucas Blanco a 20355875
console.log('9. Actualizar el dni del estudiante Lucas Blanco a 20355875');
console.log(await model.Estudiantes.updateOne({ nombre: 'Lucas', apellido: 'Blanco' }, { dni: '20355875' }));


// Agregar un campo 'ingreso' a todos los documentos con el valor false
console.log('10. Agregar un campo \'ingreso\' a todos los documentos con el valor false');
console.log(await model.Estudiantes.updateMany({}, { ingreso: false }));

// Modificar el valor de 'ingreso' a true para todos los estudiantes que pertenezcan al curso 1A
console.log(`11. Modificar el valor de 'ingreso' a true para todos los estudiantes que pertenezcan al curso 1A`);
console.log(await model.Estudiantes.updateMany({ curso: '1A' }, { ingreso: true }));

// Listar los estudiantes que aprobaron (hayan sacado de 4 en adelante) sin los campos de _id y __v
console.log('12. Listar los estudiantes que aprobaron (hayan sacado de 4 en adelante) sin los campos de _id y __v');
console.log(await model.Estudiantes.find({ nota: { $gte: 4 } }).select({ _id: 0, __v: 0 }));

















console.log('CONSULTAS con THEN')

// 1 Los estudiantes ordenados por orden alfabético según sus nombres.
// 2 El estudiante más joven.
// 3 Los estudiantes que pertenezcan al curso '2A'.
// 4 El segundo estudiante más joven.
// 5 Sólo los nombres y apellidos de los estudiantes con su curso correspondiente, ordenados por apellido descendente (z a a).
// 6 Los estudiantes que sacaron 10.
// 7 El promedio de notas del total de alumnos.
// 8 El promedio de notas del curso '1A'.

  //  model.Estudiantes.find().sort({ nombre: 1 }).then(rta => {
  //      console.log(rta);
  //      model.Estudiantes.find().sort({ edad: 1 }).then(rta => {
  //          console.log(rta);
  //          model.Estudiantes.find({ curso: '2A' }).then(rta => {
  //              console.log(rta);
  //              model.Estudiantes.find().sort({ edad: 1 }).skip(1).limit(1).then(rta => {
  //                  console.log(rta);
  //                  model.Estudiantes.find().select({ nombre: 1, apellido: 1, curso: 1 }).sort({ apellido: -1 }).then(rta => {
  //                      console.log(rta);
  //                      model.Estudiantes.find({ nota: 10 }).then(rta => {
  //                          console.log(rta);
  //                          model.Estudiantes.find().avg('nota').then(rta => {
  //                              console.log(rta);
  //                              model.Estudiantes.find({ curso: '1A' }).avg('nota').then(rta => {
  //                                  console.log(rta);
  //                              })
  //                          })
  //                      })
  //                  })
  //              })
  //          })
  //      })   
  //  })



