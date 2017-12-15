'use strict'

var express = require('express');
var UserController = require('../controllers/userCtrl');

var api = express.Router();
var mdAuth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');// midleware para subir ficheros
var mdUpload = multipart({ uploadDir: './uploads/users' });

api.get('/probando-controlador', mdAuth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', mdAuth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [mdAuth.ensureAuth, mdUpload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);

module.exports = api;