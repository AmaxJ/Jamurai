'use strict'
var mongoose = require('mongoose');
var SongData = mongoose.model('SongData');
var Song = mongoose.model('Song');

var schema = new mongoose.Schema({
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SongData"
    }],
    history: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SongData"
    }]
});

schema.method({
    addSong: function(songId, userId, roomId) {
        var self = this;
        SongData.create({
                playlist: self._id,
                song: songId,
                submittedBy: userId
            })
            .then(songDataObj => {
                self.songs.addToSet(songDataObj._id);
                return self.save();
            })
            .then(function(playlist) {
                return Song.findById(songId);
            })
            .then(function(song) {
                song.roomsRequestedIn.addToSet(roomId);
                return song.save();
            })
            .then(null, console.error.bind(console));
    },
    updateSongValue: function(songId, total) {
        return SongData.findOne({ song: songId })
            .then(function(songDataObj) {
                songDataObj.total = total;
                return songDataObj.save();
            });
    },
    removeSong: function(songObjId) {
        var self = this;
        var songDataItem;
        return SongData.findById(songObjId) //retrieve songData object
            .then(function(songDataObj) {
                songDataItem = songDataObj;
                return songDataObj;
            })
            .then(function(songdata) {
                //get matching song object from database
                return Song.findById(songdata.song)
            })
            .then(function(song) {
                //add songData score to song's total score
                song.totalScore += songDataItem.total;
                return song.save();
            })
            .then(function(savedSong) {
                //then remove song from playlist
                var indexToRemove = self.songs.indexOf(songObjId);
                self.songs.splice(indexToRemove, 1)[0].toString();
                self.history.push(songObjId); // add song to playlist history
                return self.save();
            })
            .then(null, function(err) {
                console.error("Error with playlist.removeSong: ", err);
            })
    }
});


mongoose.model('Playlist', schema);
