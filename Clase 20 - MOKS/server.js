const faker = require('faker');
const fs = require('fs');


var str = 'NOMBRE;APELLIDO;EMAIL;TRABAJO;LUGAR\r\n'

//CREAR 100 registros con faker
for (var i = 0; i < 100; i++) {
    str += faker.name.firstName() + ';'
        + faker.name.lastName() + ';'
        + faker.internet.email() + ';' 
        + faker.name.jobTitle() + ';' 
        + faker.random.locale() + '\r\n'

    //console.log(str);
}

//escribir archivo en ./test.csv
fs.writeFile('./test.csv', str, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});











