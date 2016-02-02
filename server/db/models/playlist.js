'use strict'
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    songs : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song"
    }]
});

schema.method({
    addSong: function(songId) {
        this.songs.addToSet(songId);
        return this.save();
    }
})

mongoose.model('Playlist', schema);
