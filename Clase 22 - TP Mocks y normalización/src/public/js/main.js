const socket = io();

const denormalize = normalizr.denormalize;
const schema = normalizr.schema;


/* TP Normalizr */
const authorSchema = new schema.Entity('author');
const mensajeSchema = new schema.Entity('mensaje', {
  author: authorSchema
});
const listaMensajesSchema = new schema.Array(mensajeSchema);


socket.on('productosUpdate', productitos => {
    console.log(productitos)
    ActualizarProductos(productitos)
});


function ActualizarProductos(productitos) {

    fetch('views/VerProductosRealtime.hbs')
        .then(response => response.text())
        .then(templateStr => {
            const template = Handlebars.compile(templateStr)
            const html = template(productitos)
            document.getElementById("productosEnRealTime").innerHTML = html
        })
}

function SendMesage() {
    /*
           { 
               author: {
                   id: 'mail del usuario', 
                   nombre: 'nombre del usuario', 
                   apellido: 'apellido del usuario', 
                   edad: 'edad del usuario', 
                   alias: 'alias del usuario',
                   avatar: 'url avatar (foto, logo) del usuario'
               },
               text: 'mensaje del usuario'
           }
    */

    if (document.getElementById('id').value == "" ||
        document.getElementById('nombre').value == "" ||
        document.getElementById('apellido').value == "" ||
        document.getElementById('edad').value == "" ||
        document.getElementById('alias').value == "" ||
        document.getElementById('avatar').value == "" ||
        document.getElementById('mensaje').value == "") {
        alert("Campos Incompletos")
        return false
    }

    const mensaje = {
        author: {
            id: document.getElementById('id').value,
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            edad: document.getElementById('edad').value,
            alias: document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value
        },
        text: document.getElementById('mensaje').value
    }


    socket.emit('nuevoMensaje', mensaje);
    document.getElementById('mensaje').value = "";
    return false;
}

socket.on('nuevoMensaje', mensajeNormalizado => {

    const mensajesDesnormalizado = desnormalizar(mensajeNormalizado);
    //Ratio de compresion:
    let ratio = ( 100 * JSON.stringify(mensajeNormalizado).length) / JSON.stringify(mensajesDesnormalizado).length;



    document.getElementById('CompressionRate').innerHTML = `(Compresion: ${ratio}%)`;

    let elHtml = '';
    mensajesDesnormalizado.forEach(mensaje => {
        const mail = `<div style="display:inline; color:blue;font-weight:bold">${mensaje.author.id}</div>`;
        const fechaHora = `<div style="display:inline; color:brown">${mensaje.Hora}</div>`;
        const mensajeTexto = `<div style="display:inline; color:darkgreen;font-weight:italic">${mensaje.text}</div>`;
        elHtml += `${mail} ${fechaHora}: ${mensajeTexto} <br>`;
    });
    document.getElementById('Conversacion').innerHTML = elHtml;
});

function desnormalizar (arrayComprimidoDeMensajes){
    let arrayDescomprimido = denormalize(arrayComprimidoDeMensajes.result, listaMensajesSchema, arrayComprimidoDeMensajes.entities);

    return arrayDescomprimido;
}
