'use strict'

var express = require('express');
var ArtistController = require('../controllers/artistCtrl');
var api = express.Router();

var mdAuth = require('../middlewares/authenticated');

api.get('/artist/:id', mdAuth.ensureAuth, ArtistController.getArtist);
api.post('/artist', mdAuth.ensureAuth, ArtistController.saveArtist);
api.get('/artists/:page?', mdAuth.ensureAuth, ArtistController.getArtists);
api.put('/artist/:id', mdAuth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', mdAuth.ensureAuth, ArtistController.deleteArtist);



module.exports = api;