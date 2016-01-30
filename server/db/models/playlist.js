'use strict'
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    songs : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song"
    }]
})

schema.statics.addSong = function(id, songId) {
    return this.findByIdAndUpdate( id,
        {$push: {"songs": songId}},
        { new: true });
};

mongoose.model('Playlist', schema);
