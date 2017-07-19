'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3977; //process.env.PORT || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/spotifyangular', (err, res) => {
    //funcion de callback
    if (err) {
        throw err;
    } else {
        console.log('La conexión a la base de datos esta funcionando correctamente...');

        app.listen(port, function () {
            console.log("Servidor de api rest de música escuchando en http://localhost:" + port);
        });
    }

}); // conexión a la base de datos

