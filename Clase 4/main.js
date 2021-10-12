const moment = require('moment');

const now = moment();
const nacimiento = moment("19/12/1991", "DD/MM/YYYY")
console.log("hoy es " + now.format('DD/MM/YYYY'));
console.log("nací el " + nacimiento.format('DD/MM/YYYY'));
console.log("Desde mi nacimiento han pasado " + now.diff(nacimiento, "year") + " años");
console.log("Desde mi nacimiento han pasado " + now.diff(nacimiento, "days") + " dias");


