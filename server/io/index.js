'use strict';
var socketio = require('socket.io');
var io = null;
var Song = require('mongoose').model('Song');
var Room = require('mongoose').model('Room');
var SongData = require('mongoose').model('SongData');
var PowerupData = require('mongoose').model('PowerupData');
var UserScore = require('mongoose').model('UserScore');

module.exports = function(server) {

    if (io) return io;

    io = socketio(server);

    io.on('connection', function(socket) {
        //TODO when a user joins a CREATE A USERSCORE OBJ!
        // Now have access to socket, wowzers!
        console.log('Someone connected!!!');
        //Vote functions
        socket.on('vote', function(payload) {
            var song = payload.song;
            var user = payload.user;
            var vote = payload.vote;
            var room = payload.room;
            var updatedVote;
            var savedSongData;
            var playlist = payload.room.playlist;
            SongData.findOne({
                    _id: song._id
                })
                .then(function(songData) {
                    return songData.vote(user._id, vote)
                })
                .then(function(songData) {
                    updatedVote =  songData.total - song.total;
                    return SongData.findById(songData._id)
                        .populate('song')

                })
                .then(function(songDataObj) {
                    savedSongData = songDataObj;
                    return Room.findById(room._id)
                })
                .then(function(room) {
                    return room.addToScore(savedSongData, updatedVote);
                })
                .then(room => {
                    io.emit('updateVotes', {
                        updatedSong: savedSongData,
                        updatedRoom: room
                    });
                })
                .then(null, function(err) {
                    console.log('Something went wrong with songData', err);
                })

        })
        //User leaves room
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
        //User enters room
        socket.on('userEntered', function(data) {
            let roomId = data.roomId;
            let userId = data.userId;

            Room.findById(roomId)
                .then((room) => {
                    return room.addUser(userId);
                })
                .then((room) => {
                    io.emit('updateUsers', room);
                })
        })
        //Add a powerup
        socket.on('addPowerUp', function(payload){
            var playlist = payload.playlist;
            var userId = payload.user;

            Room.findOne({playlist: playlist})
            .then(function(room){
                return PowerupData.findOne({room: room._id, user: userId})
            })
            .then(function(powerupData){
                return powerupData.addPowerup();
            })
            .then((updatedPowerups)=> {
                io.emit('updatePowerups', updatedPowerups)
            })
        })
        //Use a powerup
        socket.on('usePowerUp', function(payload){
            var powerup = payload.powerup;
            var user = payload.user;
            var room = payload.room;
            PowerupData.findOne({room: room._id, user: user._id})
            .then((powerupData)=> {
                return powerupData.usePowerup(powerup);
            })
            .then((updatedPowerups)=> {
                io.emit('updatePowerups', updatedPowerups)
            })
        })
        //Death stars powerup
        socket.on('deathStars', function(payload){
            var user = payload.user;
            var room = payload.room;
            var starStrength = -3;
            //Initialize array to track users effected by stars
            var effectedUsers = [];
            return SongData.find({playlist: room.playlist._id, submittedBy: {$ne: user._id}})
            .then(songDataArr => {
                songDataArr.forEach(songDataDoc => {
                    songDataDoc.changeScore(starStrength);
                    //For each song that was hit with a death star, push that users' ID into the effected users array
                    effectedUsers.push(songDataDoc.submittedBy);
                })
            })
            .then(()=> {
                return UserScore.find({user: {$ne: user._id}})
            })
            .then(userScoreArr => {
                userScoreArr.forEach(userScoreDoc => {
                    //Count the number of instances of this user in the effectedUsers array and multiple that number by the strength of each death star
                    var scoreUpdate = effectedUsers.filter(userId => {
                        return userId = userScoreDoc.user;
                    }).length * starStrength;
                    userScoreDoc.changeScore(scoreUpdate);
                })
            })
            .then(()=> {
                return Room.findById(room._id)
                    .populate('users')
                    .populate({
                        path: 'userScores',
                        model: 'UserScore',
                        populate: {
                            path: "user",
                            model: "User"
                        }
                    })
                    .populate({
                        path: 'playlist',
                        model: 'Playlist',
                        populate: {
                            path: 'songs',
                            model: 'SongData',
                            populate: {
                                path: 'song',
                                model: 'Song'
                            }
                        }
                    })
            })
            .then(updatedRoom => {
                var playlist = updatedRoom.playlist;
                io.emit('updateRoom', {room: updatedRoom, playlist: playlist});
            })
        })
    });

    return io;

};
