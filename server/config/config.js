//PUERTO
process.env.PORT = process.env.PORT || 3000;

//ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//BASE DE DATOS
let urlDB;

if( process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
} else{ 
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//EXPIRED TOKEN
process.env.CADUCIDAD_TOKEN = '720h'; 

//SEED
process.env.SEED = process.env.SEED || "este-es-el-seed-de-desarrollo";

//Google Client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || "404075729198-ptubn75gcrnd5svctlclucifpoaf93nu.apps.googleusercontent.com"