const mongoose = require('mongoose')

const usuariosSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    nombre: { type: String, required: true },
    contador: { type: Number, required: true }
})
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000}
const mongoUrl = 'mongodb+srv://admin:Merluza23@cluster0.vuapg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

class UsuariosDao {

    constructor() {
        this.mongoose = mongoose
        this.usuariosSchema = usuariosSchema
        this.Usuarios = this.mongoose.model('Usuarios', this.usuariosSchema)
        this.mongoose.connect(mongoUrl, advancedOptions)
        
    }

    async getUsuarios() {
        return await this.Usuarios.find({})
    }

    async getUsuario(email) {
        return await this.Usuarios.findOne({ email: email })
    }

    async userExists(email) {
        return await this.Usuarios.exists({ email: email })
    }

    async addUsuario(usuario) {
        if (await this.userExists(usuario.email)) {
            return {error: 'El usuario ya existe'};
        } else if (this.validarUsuario(usuario)) {
            return await this.Usuarios.create(usuario)
        } else {
            return {error: 'El usuario no es valido'};
        }
    }

    validarUsuario(usuario) {
        if (usuario.username && usuario.email && usuario.password && usuario.nombre) {
            return true 
        }
        return false
    }

    async checkPassword(email, password) {
        if (await this.userExists(email)) {
            const usuarioDB = await this.getUsuario(email)
            if (usuarioDB.password == password) {
                return true
            }
        }
        return false
    }

    


    async updateUsuario(usuario) {
        return await this.Usuarios.updateOne({ email: usuario.email }, usuario)
    }

    async deleteUsuario(email) {
        return await this.Usuarios.deleteOne({ email: email })
    }
}

exports.UsuariosDao = UsuariosDao