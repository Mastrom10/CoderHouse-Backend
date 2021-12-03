//servidor express
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');


app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.use(session({
    secret: 'secreto',
    resave: true,
    saveUninitialized: true
}));  

//contador de req.session.contador
app.get("/con-session",  (req, res) => {
    if(req.session.contador){
        req.session.contador++;
        res.send(`Contador: ${req.session.contador}`);
    }else{
        req.session.contador = 1;
        res.send("Bienvenido")
    }
}   )














/*
Definir una ruta “cookies”.
Definir un método POST que reciba un objeto con el nombre de la cookie, su valor y el tiempo de duración en segundos, y que genere y guarde dicha cookie.
*/
app.post('/cookies', (req, res) => {
    let cookie = req.body;

    //Si algún parámetro recibido es inválido, o directamente inexistente, el servidor devolverá un objeto de error. "{ error: 'falta nombre ó valor' } "
    if (!cookie.nombre || !cookie.valor) {
        res.status(400).json({ error: 'falta nombre ó valor' });
        return;
    }

    // Si el tiempo no está presente, generar una cookie sin tiempo de expiración.
    if (!cookie.expiracion) {
        res.cookie(cookie.nombre, cookie.valor);
    } else {
        res.cookie(cookie.nombre, cookie.valor, {
            maxAge: cookie.expiracion * 1000
        });
    }
    
    res.json({ proceso: 'ok'});
    
});

/* Definir un método GET que devuelva todas las cookies presentes.*/
app.get('/cookies', (req, res) => {
    res.json(req.cookies);
});


/* Definir un método DELETE que reciba el nombre de una cookie por parámetro de ruta, y la elimine.*/ 
app.delete('/cookies/:name', (req, res) => {

    //{ error: 'nombre no encontrado' }
    if (!req.cookies[req.params.name]) {
        res.status(400).json({ error: 'nombre no encontrado' });
        return;
    }
    
    res.clearCookie(req.params.name);
    res.json({ proceso: 'ok'});
});


/* Si algún parámetro recibido es inválido, o directamente inexistente, el servidor devolverá un objeto de error. */
app.use((req, res, next) => {
    res.status(404).json({ error: 'Recurso no encontrado' });
});




const port = 8080;

//iniciar servidor
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
}
);
//loguear errores
app.on('error', (error) => {
    console.log(error);
}
);


