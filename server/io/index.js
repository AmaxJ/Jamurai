'use strict';
var socketio = require('socket.io');
var io = null;
var Song = require('mongoose').model('Song');
var Room = require('mongoose').model('Room');
var SongData = require('mongoose').model('SongData');


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
            SongData.findOne({_id: song._id})
            .then(function(songData){
                return songData.vote(user._id, vote)
            })
            .then(function(songData){
                return SongData.findById(songData._id)
                    .populate('song')
            })
            .then(songData => {
        	   io.emit('updateVotes', songData);
            })
            .then(null, function(err){
                console.log('Something went wrong with songData', err);
            })

        })
        socket.on('userLeft', function(data) {
            let roomId = data.roomId;
            let userId = data.userId;

            Room.findById(roomId)
            .then((room) => {
                return room.removeUser(userId);
            })
            .then((room) => {
                io.emit('updateUsers', room);
            })
        })
        socket.on('userEntered', function(data) {
            let roomId = data.roomId;
            let userId = data.userId;

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
