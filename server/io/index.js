'use strict';
var socketio = require('socket.io');
var io = null;
var Song = require('mongoose').model('Song');
var Room = require('mongoose').model('Room');

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
        socket.on('userLeft', function(data) {
            console.log('user left:', data)
            let roomId = data.roomId;
            let userId = data.userId;

            Room.findById(roomId)
            .then((room) => {
                console.log('old room', room)
                return room.removeUser(userId);
            })
            .then((room) => {
                console.log('updated room', room)
                io.emit('updateUsers', room);
            })
        })
        socket.on('userEntered', function(data) {
            let roomId = data.roomId;
            let userId = data.userId;
            console.log('enter user', data);

            Room.findById(roomId)
            .then((room) => {
                return room.addUser(userId);
            })
            .then((room) => {
                io.emit('updateUsers', room)
            })
        })
    });
    
    return io;

};
