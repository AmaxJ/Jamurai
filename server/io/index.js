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
        socket.on('vote', function(song){
            var songId = song._id;
        	io.emit('updateVotes', song);
            // Song.findById(songId)
            // .then(function(song) {
            //     song.
            // }).then(null, next);
        })
    });
    
    return io;

};
