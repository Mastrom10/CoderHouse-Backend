import cluster from 'cluster';
import express from 'express';
import { cpus } from 'os';

const numCPUs = cpus().length;
console.log (`Cantidad de CPUS: ${numCPUs}`);

if (cluster.isMaster){
    console.log (`Cantidad de CPUS: ${numCPUs}`);
    console.log (`Ejecutando en el proceso ${process.pid}`);

    for (let i = 0; i < numCPUs; i++){
        cluster.fork();
    }
    cluster.on('exit', worker => {
        console.log(`El proceso ${worker.process.pid} terminó`);
        cluster.fork();
    });
} else {
    console.log (`Proceso ${process.pid} iniciado`);
    const app = express();
    app.get('/', (req, res) => {
        console.log(`Respondiendo desde:  ${process.pid}`);
        res.send('Hola mundo from process.pid: ' + process.pid);
    });
    app.listen(8080);

}