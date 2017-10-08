'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar rutas
var user_routes = require('./routes/userRts');
var artist_routes = require('./routes/artistRts');
var album_routes = require('./routes/albumRts');
var song_routes = require('./routes/songRts');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' })); //convierte a json las peticiones http

// configurar cabeceras http


// carga de rutas base
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);

module.exports = app;