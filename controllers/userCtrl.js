'use strict'

function pruebas(req, res) {
    var mess = {
        message: "Probando una acción del controlador de usuarios del api rest con Node y Mongo"
    };

    console.log(mess);

    res.status(200).send(mess);
}

module.exports = {
    pruebas
};