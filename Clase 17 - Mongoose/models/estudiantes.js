import  Mongoose from "mongoose";



const estudiantesCollection = "Estudiantes";

/*
nombre: tipo string
apellido: tipo string
edad: tipo number
dni: tipo string (campo único)
curso: tipo string
nota: tipo number
*/
const estudiantesSchema = new Mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    edad: { type: Number, required: true },
    dni: { type: String, required: true, unique: true },
    curso: { type: String, required: true },
    nota: { type: Number, required: true }
});

export const Estudiantes = Mongoose.model(estudiantesCollection, estudiantesSchema);

