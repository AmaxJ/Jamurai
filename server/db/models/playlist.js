'use strict'
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song"
    }],

    songData: {
        type: mongoose.Schema.Types.Mixed
    }
});

schema.method({
    addSong: function(songId) {
        this.songs.addToSet(songId);
        if (!this.songData) {
            this.songData = {}
        }
        this.songData[songId] = {
            value: 0,
            upVoters: [],
            downVoters: []
        };
        this.markModified('songData');
        return this.save();
    },
    updateSongValue: function(songId, total) {
        if (!(songId in this.songData)) return;
        this.songData[songId].value = total;
        var path = 'songData.' + songId;
        console.log("PATH:", path);
        this.markModified(path);
        return this.save();
    }
});

schema.post('init', function(doc) {
    doc.songData = {};
    doc.songs.forEach(function(songId) {
        doc.songData[songId] = {
            value: 0,
            upVoters: [],
            downVoters: []
        };
    });
    doc.markModified('songData')
    doc.save();
});

mongoose.model('Playlist', schema);
