const socket = io();

socket.on('productosUpdate', productitos => {
    console.log(productitos)
    ActualizarProductos(productitos)
});


function ActualizarProductos(productitos){

    fetch('views/VerProductosRealtime.hbs')
      .then(response => response.text())
      .then(templateStr => {
        const template = Handlebars.compile(templateStr)
        const html = template(productitos)
        document.getElementById("productosEnRealTime").innerHTML = html
      })
}

function SendMesage(){
    if (document.getElementById('mail').value == "" || document.getElementById('mensaje').value == "") {
        alert("Campos Incompletos")
        return false
    }

    const mensaje = {
        mail: document.getElementById('mail').value,
        mensaje: document.getElementById('mensaje').value
    }
    socket.emit('nuevoMensaje', mensaje);
    return false;
}

socket.on('nuevoMensaje', mensaje => {
    const mail = `<div style="display:inline; color:blue;font-weight:bold">${mensaje.mail}</div>`;
    const fechaHora = `<div style="display:inline; color:brown">${mensaje.Hora}</div>`;
    const mensajeTexto = `<div style="display:inline; color:darkgreen;font-weight:italic">${mensaje.mensaje}</div>`;
    //let elemento = new DOMParser().parseFromString(`<p> ${mail} ${fechaHora}: ${mensajeTexto} </p>`, "text/html");

    document.getElementById("Conversacion").insertAdjacentHTML('beforeend', `${mail} ${fechaHora}: ${mensajeTexto} <br>`)
    //document.getElementById("Conversacion").appendChild(elemento.firstChild);
    console.log(mensaje)
});
