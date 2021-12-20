//importamos minimist
const minimist = require('minimist');
const args = minimist(process.argv.slice(2));

const {exec} = require('child_process');

exec('ls /asas -lh', (err, stdout, stderr) => {
    if (err) {
        console.log(`Code: ${err.code} error: ${err.message}`);
        console.log(`stderr: ${stderr}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});





function promedio(numeros) {

    let suma = 0;
    for (let i = 0; i < numeros.length; i++) {
        if (numeros[i].type !== 'number') {
            throw new Error('El parametro no es un numero');
        }

        suma += numeros[i];
    }
    return suma / numeros.length;
}



/* calcular el siguiente Json con los numeros que vienen por parametros. 
    {
        datos:{
            numeros:[1,2,3,4,5,6,7,8,9,10]
            promedio: 5.5
            min: 1
            max: 10
            ejecutable: 'server.js'
            pid: 1234
        }
    }

*/
function armarJson(){
    let datos = {
        numeros: args._,
        promedio: promedio(args._),
        min: Math.min(...args._),
        max: Math.max(...args._),
        ejecutable: process.argv[1],
        pid: process.pid
    }
    return datos;
}

//console.log(armarJson());









// Algunos ejemplos de los datos del proceso que se pueden consultar con el objeto process.

function getProcessInfo() {
    console.log('CWD: ' + process.cwd());
    console.log('PID: ' + process.pid);
    console.log('PPID: ' + process.ppid);
    console.log('Version: ' + process.version);
    console.log('Nombre: ' + process.title);
    console.log('platform: ' + process.platform);
    console.log('Memory Statistics: ' + parseJSON(process.memoryUsage()));
    console.log('Uptime: ' + process.uptime());
    console.log('Arguments: ' + parseJSON(process.argv));
    console.log('Exec Path: ' + process.execPath);
    console.log('Exec Args: ' + parseJSON(process.execArgv));    
}

function parseJSON(json) {
    return JSON.stringify(json, null, 2);
}


//getProcessInfo();


/*
process.on('beforeExit', (code) => {
    console.log('About to exit with code: ' + code);
});


process.on('exit', (code) => {
    console.log('Exited with code: ' + code);
    console.log('Este ya es un punto de no retorno.');

});


process.on('uncaughtException', (err) => {

    console.log(`Normalmente el programa sale. pero como estoy sobreescribiendo el Listener, 
                 si no especifico el process.exit() el programa no sale`);
    console.log('Excepcion no controlada. uncaught Exception: ' + err);
} );

*/
