'use strict'

var express = require('express');
var ArtistController = require('../controllers/artistCtrl');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');// midleware para subir ficheros
var mdUpload = multipart({ uploadDir: './uploads/artist' });

api.get('/artist/:id', mdAuth.ensureAuth, ArtistController.getArtist);
api.post('/artist', mdAuth.ensureAuth, ArtistController.saveArtist);
api.get('/artists/:page?', mdAuth.ensureAuth, ArtistController.getArtists);
api.put('/artist/:id', mdAuth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', mdAuth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id', [mdAuth.ensureAuth, mdUpload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);



module.exports = api;