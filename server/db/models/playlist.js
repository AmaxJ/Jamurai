'use strict'
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    room : {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    songs : {
        type: [mongoose.Schema.Types.ObjectId],
        ref: Song
    }
})

schema.statics.addSong = function(id, songId) {
    return this.findByIdAndUpdate( id,
        {$push: {"songs": songId}},
        { new: true });
};
