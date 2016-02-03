'use strict'
var mongoose = require('mongoose');
var SongData = mongoose.model('SongData');

var schema = new mongoose.Schema({
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SongData"
    }],
});

schema.method({
    addSong: function(songId) {
        var self = this;
        SongData.create({playlist: self._id, song: songId})
        .then(songDataObj => {
            self.songs.addToSet(songDataObj._id);
            return self.save();
        })
        .then(null, console.error.bind(console));
    },
    updateSongValue : function(songId, total) {
        return SongData.findOne({song: songId})
            .then(function(songDataObj) {
                songDataObj.total = total;
                return songDataObj.save();
            });
    }
});


mongoose.model('Playlist', schema);
