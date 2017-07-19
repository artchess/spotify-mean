'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar rutas
var user_routes = require('./routes/userRts');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' })); //convierte a json las peticiones http

// configurar cabeceras http


// carga de rutas base
app.use('/api', user_routes);

module.exports = app;