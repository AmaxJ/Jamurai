'use strict'
var mongoose = require('mongoose');
var SongData = mongoose.model('SongData');

var schema = new mongoose.Schema({
    songs : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song"
    }],
});

schema.method({
    addSong: function(songId) {
        var id = this._id;
        this.songs.addToSet(songId);
        return this.save()
            .then(function() {
                return SongData.create({
                    playlist : id,
                    song : songId
                })
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

// schema.post('init', function(doc) {
//     var songDataObjs = [];
//     doc.songs.forEach(function(song) {
//         songDataObjs.push({
//             song: song,
//             playlist: doc._id
//         });
//     })
//     console.log("SONGDATA", songDataObjs);
//     SongData.create(songDataObjs);
// });

mongoose.model('Playlist', schema);
