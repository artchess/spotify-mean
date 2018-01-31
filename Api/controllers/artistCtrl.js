'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res) {
    var artistId = req.params.id;

    Artist.findById(artistId,
        (err, artist) => {
            if (err) {
                res.status(500).send({ message: 'Error en la petición' });
            } else {
                if (!artist) {
                    res.status(404).send({ message: 'El artista no existe' });
                } else {
                    res.status(200).send({ artist });
                }
            }
        });
}

function getArtists(req, res) {
    var page = req.params.page || 1;
    var itemsPerPage = 4;

    Artist.find().sort('name').paginate(page,
        itemsPerPage,
        (err, artists, total) => {
            if (err) {
                res.status(500).send({ message: 'Error en la petición' });
            } else {
                if (!artists) {
                    res.status(404).send({ message: 'No hay artistas!' });
                } else {
                    return res.status(200).send({
                        artists: artists,
                        totalItems: total
                    });
                }
            }
        });
}

function saveArtist(req, res) {
    var artist = new Artist();

    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        if (err) {
            res.status(500).send({ message: 'Error al guardar el artista' });
        } else {
            if (!artistStored) {
                res.status(404).send({ message: 'El artista no ha sido guardado' });
            } else {
                res.status(200).send({ artist: artistStored });
            }
        }
    });
}

function updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId,
        update,
        (err, artistUpdated) => {
            if (err) {
                res.status(500).send({ message: 'Error al guardar el artista' });
            } else {
                if (!artistUpdated) {
                    res.status(404).send({ message: 'El artista no ha sido actualizado' });
                } else {
                    res.status(200).send({ artist: artistUpdated });
                }
            }
        });
}

function deleteArtist(req, res) {
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId,
        (err, artist) => {
            if (err) {
                res.status(500).send({ message: 'Error al eliminar el artista' });
            } else {
                if (!artist) {
                    res.status(404).send({ message: 'El artista no ha sido eliminado' });
                } else {
                    // Cuando se elimina el artista borramos todo lo asociado a el

                    Album.find({ artist: artist._id }).remove((err, albumRemoved) => {
                        if (err) {
                            res.status(500).send({ message: 'Error al eliminar el album' });
                        } else {
                            if (!albumRemoved) {
                                res.status(404).send({ message: 'El album no ha sido eliminado' });
                            } else {

                                Song.find({ artist: albumRemoved._id }).remove((err, songRemoved) => {
                                    if (err) {
                                        res.status(500).send({ message: 'Error al eliminar la canción' });
                                    } else {
                                        if (!songRemoved) {
                                            res.status(404).send({ message: 'La canción no ha sido eliminada' });
                                        } else {
                                            res.status(200).send({ artist });

                                        }
                                    }
                                });

                            }
                        }
                    });
                }
            }
        });
}

function uploadImage(req, res) {
    var artistId = req.params.id;

    if (req.files) {
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[2];

        var extSplit = fileName.split('\.');
        var fileExt = extSplit[1];

        if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'gif') {
            Artist.findByIdAndUpdate(artistId, { image: fileName }, (err, artistUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'Error al guardar el archivo' });
                } else {
                    if (!artistUpdated) {
                        res.status(404).send({ message: 'No se ha podido actualizar el artista' });
                    } else {
                        res.status(200).send({ artist: artistUpdated });
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
    var pathFile = './uploads/artist/' + imageFile;
    fs.exists(pathFile,
        function (exists) {
            if (exists) {
                res.sendFile(path.resolve(pathFile));
            } else {
                res.status(500).send({ message: 'No existe la imagen...' });
            }
        });
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};