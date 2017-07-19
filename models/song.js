'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //para guardar utilizando el schema

var SongSchema = Schema({
    number: String,
    name: String,
    duration: String,
    file: String,
    album: { type: Schema.ObjectId, ref: 'Album' }
});

module.exports = mongoose.model('Song', SongSchema);