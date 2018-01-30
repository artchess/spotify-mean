'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs'); // este modulo se utiliza para encriptar contraseñas.
var User = require('../models/user');
var jwt = require('../services/jwt');

function pruebas(req, res) {
    var mess = {
        message: "Probando una acción del controlador de usuarios del api rest con Node y Mongo"
    };

    console.log(mess);

    res.status(200).send(mess);
}

function saveUser(req, res) {
    var user = new User();

    var params = req.body;

    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_ADMIN';
    user.image = null;

    if (params.password) {
        // Encriptar contraseña y guardar datos.
        bcrypt.hash(params.password, null, null, function (err, hash) {
            user.password = hash;
            if (user.name != null && user.surname != null && user.email != null){
                //guardar el usuario 
                user.save((err, userStored) => {
                    if (err) {
                        res.status(500).send({ message: 'Error al guardar el usuario' });
                    }
                    else {
                        if (!userStored)
                        {
                            res.status(404).send({ message: 'No se ha registrado el usuario' });
                        } else {
                            res.status(200).send({ user: userStored });
                        }
                    }
                });
            }
            else{
                res.status(200).send({ message: 'Introduce todos los campos' });
            }
        })
    } else {
        res.status(200).send({message: 'Introduce la contraseña'});
    }
}

function loginUser(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({ email: email.toLowerCase() },
        (err, user) => {
            if (err) {
                res.status(500).send({ message: 'Error en la petición' });
            } else {
                if (!user) {
                    res.status(404).send({ message: 'El usuario no existe' });
                } else {
                    // Comprobar la contraseña 
                    bcrypt.compare(password,
                        user.password,
                        function(err, check) {
                            if (check) {
                                // Devolver los datos del usuario logeado
                                if (params.gethash) {
                                    //devolver un token de jwt
                                    res.status(200).send({ token: jwt.createToken(user) });
                                } else {
                                    res.status(200).send({ user });
                                }
                            } else {
                                // Devolver que la contraseña es incorrecta
                                res.status(404).send({ message: 'El usuario no ha podido loguearse' });
                            }
                        });
                }
            }
        });
}

function updateUser(req, res) {
    var userId = req.params.id; //id se saca de la url
    var update = req.body;

    if (userId != req.user.sub) { // si el JWT pertenece a un usuario que no es el usuario que vamos a actualizar no le dejo actualizarlo
        return res.status(500).send({ message: 'No tienes permiso para actualizar este usuario' });
    }

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error al actualizar el usuario' });
        } else {
            if (!userUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
            } else {
                res.status(200).send({ user: userUpdated });
            }
        }
    });
}

function uploadImage(req, res) {
    var userId = req.params.id;

    if (req.files) {
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[2];

        var extSplit = fileName.split('\.');
        var fileExt = extSplit[1];

        if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'gif') {
            User.findByIdAndUpdate(userId, { image: fileName }, (err, userUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'Error al guardar el archivo' });
                } else {
                    if (!userUpdated) {
                        res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
                    } else {
                        res.status(200).send({ image: fileName, user: userUpdated });
                    }
                }
            });
        } else {
            res.status(500).send({ message: 'Extensión del archivo no es válida' });
        }

        //console.log(filePath);
    } else {
        res.status(500).send({ message: 'No has subido ninguna imagen' });
    }
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/users/' + imageFile;
    fs.exists(pathFile,
        function(exists) {
            if (exists) {
                res.sendFile(path.resolve(pathFile));
            } else {
                res.status(500).send({ message: 'No existe la imagen...' });
            }
        });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};