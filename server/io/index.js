'use strict';
var socketio = require('socket.io');
var io = null;
var Song = require('mongoose').model('Song');

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    io.on('connection', function (socket) {
        // Now have access to socket, wowzers!
        console.log('Someone connected!!!');
        socket.on('vote', function(payload){
            var song = payload.song;
            var user = payload.user;
            var vote = payload.vote;
            var room = payload.room;
            var playlist = payload.room.playlist;
            if (payload.vote === 'up') {
                song.voteValue++;
            } 
            else payload.vote--;
            SongData.findOne({playlist: playlist._id, song: song_.id})
            
        	io.emit('updateVotes', song);

            // Song.findById(songId)
            // .then(function(song) {
            //     song.
            // }).then(null, next);
        })
    });
    
    return io;

};
