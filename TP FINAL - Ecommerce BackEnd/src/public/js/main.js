

function CargarProductos() {
    fetch('http://localhost:8080/api/productos')
        .then(res => res.json())
        .then(data => {
            let html = '';
            data.forEach(producto => {
                html += `
            <div class="col-12">
                <div class="card mb-4 shadow-sm">
                    <img src="${producto.foto}" class="card-img-top p-3" style="width: 100%; height: 10vw;object-fit: scale-down;" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre} <span class="text-success">$ ${producto.precio} </span></h5>
                        <p class="card-text">${producto.descripcion}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                                <button type="button" class="btn btn-sm btn-outline-secondary" onclick="AgregarProductoCarritoSeleccionado(${producto.id})">Agregar Al Carrito</button>
                                <button type="button" class="btn btn-sm btn-outline-secondary" onclick="EliminarProducto(${producto.id})">Borrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
            });
            document.getElementById('ContenedorProductos').innerHTML = html;
        });

}

window.onload = function () {
    CargarProductos();
    CargarCarritos();
}


function CargarCarritos() {
    fetch('http://localhost:8080/api/carrito')
        .then(res => res.json())
        .then(data => {
            let html = '';
            data.forEach(carrito => {
                html += `
            <div class="col-12" id="carrito-${carrito.id}">
                <div class="card mb-4 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">Carrito Nro ${carrito.id}</h5>
                        <p class="card-text">Fecha de Creacion ${timeConverter(carrito.timestamp / 1000)}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                                <button type="button" class="btn btn-sm btn-outline-secondary" onclick="SeleccionarCarrito(${carrito.id})">Seleccionar</button>
                                <button type="button" class="btn btn-sm btn-outline-secondary" onclick="borrarCarrito(${carrito.id})" >Borrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
            });
            document.getElementById('ContenedorCarritos').innerHTML = html;
        });

}

function borrarCarrito(id) {
    fetch(`http://localhost:8080/api/carrito/${id}`, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(data => {
            document.getElementById(`carrito-${id}`).remove();
        })
}

function crearCarrito() {
    fetch('http://localhost:8080/api/carrito', {
        method: 'POST'
    })
        .then(res => res.json())
        .then(data => {
            CargarCarritos();
        })
}

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}


function GuardarProducto(form) {
    let admin = document.getElementById('adminCheck').checked;
    let producto = {
        id: form.id.value,
        nombre: form.nombre.value,
        descripcion: form.descripcion.value,
        precio: form.precio.value,
        foto: form.foto.value,
        codigo: form.codigo.value,
        stock: form.stock.value
    }

    if (!form.id.value) {
        fetch('http://localhost:8080/api/productos', {
            method: 'POST',
            body: JSON.stringify(producto),
            headers: {
                'Content-Type': 'application/json',
                'esAdmin': admin
            }
        })
            .then(
                (res) => {
                    if (res.status == 403) {
                        alert('No tienes permisos para realizar esta accion');
                    }
                    if (res.status == 400) {
                        alert('Datos invalidos');
                    }
                    return res.json()
                }
            )
            .then(data => {
                CargarProductos();
                ToggleFormCrearProducto();
            }
            ).catch(err => console.log(err))
    } else {
        fetch(`http://localhost:8080/api/productos/${form.id.value}`, {
            method: 'PUT',
            body: JSON.stringify(producto),
            headers: {
                'Content-Type': 'application/json',
                'esAdmin': admin
            }
        })
            .then(
                (res) => {
                    if (res.status == 403) {
                        alert('No tienes permisos para realizar esta accion');
                    }
                    if (res.status == 400) {
                        alert('Datos invalidos');
                    }
                    return res.json()
                }
            )
            .then(data => {
                CargarProductos();
            }
            ).catch(err => console.log(err))
    }

    return false;
}


function ToggleFormCrearProducto() {
    document.getElementById('CrearProducto').classList.toggle('d-none');
    document.getElementById("btntoggleProducto").innerHTML = document.getElementById("btntoggleProducto").innerHTML == 'Crear' ? 'Cancelar' : 'Crear';
}


function actualizarIDCarritoSeleccionado(id) {
    document.getElementById('idCarritoSeleccionado').innerHTML = id;
    CarritoSeleccionado = id;
}

let CarritoSeleccionado = 0;
function SeleccionarCarrito(id) {
    fetch(`http://localhost:8080/api/carrito/${id}`)
        .then(res => res.json())
        .then(data => {
            let html = '';
            data.productos.forEach(producto => {
                html += `
            <div class="col-12" id="producto-${producto.id}">
                <div class="card mb-4 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">Precio: ${producto.precio}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                                <button type="button" class="btn btn-sm btn-outline-secondary" onclick="QuitarProductoCarrito(${id}, ${producto.id})" >Borrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
            }
            );
            document.getElementById('ContenedorProductosCarritos').innerHTML = html;
            actualizarIDCarritoSeleccionado(id);
        });
}

function AgregarProductoCarritoSeleccionado(id) {
    if (CarritoSeleccionado == 0) {
        alert('Selecciona un carrito');
        return;
    }
    fetch(`http://localhost:8080/api/productos/${id}`, {
        method: 'GET'
    })
        .then(res => res.json())
        .then(data => {
            let producto = {
                id: data.id,
                nombre: data.nombre,
                descripcion: data.descripcion,
                precio: data.precio,
                foto: data.foto,
                codigo: data.codigo,
                stock: data.stock
            }
            fetch(`http://localhost:8080/api/carrito/${CarritoSeleccionado}/productos`, {
                method: 'POST',
                body: JSON.stringify(producto),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(
                    (res) => {
                        if (res.status == 403) {
                            alert('No tienes permisos para realizar esta accion');
                        }
                        if (res.status == 400) {
                            alert('Datos invalidos');
                        }
                        return res.json()
                    }
                )
                .then(data => {
                    SeleccionarCarrito(CarritoSeleccionado);
                }
                ).catch(err => console.log(err))
        }
    ).catch(err => console.log(err))
}

function QuitarProductoCarrito(id, idProducto) {
    fetch(`http://localhost:8080/api/carrito/${id}/productos/${idProducto}`, {
        method: 'DELETE'
    })
        .then(
            (res) => {
                if (res.status == 403) {
                    alert('No tienes permisos para realizar esta accion');
                }
                if (res.status == 400) {
                    alert('Datos invalidos');
                }
                return res.json()
            }
        )
        .then(data => {
            SeleccionarCarrito(id);
        }
        ).catch(err => console.log(err))
}

function EliminarProducto(id) {
    let admin = document.getElementById('adminCheck').checked;

    fetch(`http://localhost:8080/api/productos/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'esAdmin': admin
        }
    })
        .then(
            (res) => {
                if (res.status == 403) {
                    alert('No tienes permisos para realizar esta accion');
                }
                if (res.status == 400) {
                    alert('Datos invalidos');
                }
                return res.json()
            }
        )
        .then(data => {
            CargarProductos();
        }
        ).catch(err => console.log(err))
}