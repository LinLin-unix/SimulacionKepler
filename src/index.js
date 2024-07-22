// index.js
require('dotenv').config();
const express = require('express');
const config = require('./server/config');

// Crear la aplicación express
const app = express();

// Configurar la aplicación utilizando config.js
config(app);

// Iniciar el servidor
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});