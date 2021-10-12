const fs = require('fs');

function crearPromesa(){
    return new Promise(function(resolve, reject){
        resolve(10)
    })
}

let a = crearPromesa();
a.then(r => console.log(r)).then(r => console.log(r))


f