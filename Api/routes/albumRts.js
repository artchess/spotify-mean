'use strict'

var express = require('express');
var AlbumController = require('../controllers/albumCtrl');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');// midleware para subir ficheros
var mdUpload = multipart({ uploadDir: './uploads/album' });

api.get('/album/:id', mdAuth.ensureAuth, AlbumController.getAlbum);
api.post('/album', mdAuth.ensureAuth, AlbumController.saveAlbum);
api.get('/albums/:artist?', mdAuth.ensureAuth, AlbumController.getAlbums);
api.put('/album/:id', mdAuth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', mdAuth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [mdAuth.ensureAuth, mdUpload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);

module.exports = api;