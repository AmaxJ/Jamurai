'use strict';
var socketio = require('socket.io');
var io = null;
var Song = require('mongoose').model('Song');
var Room = require('mongoose').model('Room');
var SongData = require('mongoose').model('SongData');

module.exports = function(server) {

    if (io) return io;

    io = socketio(server);

    io.on('connection', function(socket) {
        //TODO when a user joins a CREATE A USERSCORE OBJ!
        // Now have access to socket, wowzers!
        console.log('Someone connected!!!');
        socket.on('vote', function(payload) {
            var song = payload.song;
            var user = payload.user;
            var vote = payload.vote;
            var room = payload.room;
            var savedSongData;
            var playlist = payload.room.playlist;
            SongData.findOne({
                    _id: song._id
                })
                .then(function(songData) {
                    return songData.vote(user._id, vote)
                })
                .then(function(songData) {
                    return SongData.findById(songData._id)
                        .populate('song')
                })
                .then(function(songDataObj) {
                    console.log("SOCKET SONGDATAOBJ:", songDataObj);
                    savedSongData = songDataObj;
                    return Room.findById(room._id)
                })
                .then(function(room) {
                    //TODO figure out amount to increment by
                    return room.addToScore(savedSongData, 1);
                })
                .then(room => {
                    io.emit('updateVotes', {
                        updatedSong : savedSongData,
                        updatedRoom : room
                    });
                })
                .then(null, function(err) {
                    console.log('Something went wrong with songData', err);
                })

        })
    });

    return io;

};
