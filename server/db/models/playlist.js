'use strict'
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    songs : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song"
    }],

    songData : {
        type: mongoose.Schema.Types.Mixed
    }
});

schema.method({
    addSong: function(songId) {
        this.songs.addToSet(songId);
        if (!this.songData) {this.songData = {};}
        this.songData[songId] = 0;
        return this.save();
    },
    updateSongValue : function(songId, total) {
        if (!(songId in this.songData)) return;
        this.songData[songId] = total;
        this.markModified('songData');
        return this.save();
    }

});

mongoose.model('Playlist', schema);
