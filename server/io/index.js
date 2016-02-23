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
                        updatedVote = songData.total - song.total;
                        return SongData.findById(songData._id)
                            .populate('song')
                            .populate([{
                                path: 'song',
                                model: 'Song'
                            }, {
                                path: 'submittedBy',
                                model: 'User'
                            }])

                    })
                    .then(function(songDataObj) {
                        savedSongData = songDataObj;
                        return Room.findById(room._id)
                    })
                    .then(function(room) {
                        return room.addToScore(savedSongData, updatedVote);
                    })
                    .then(room => {
                        var playlist = room.playlist;
                        io.in(room._id).emit('updateRoom', {
                            playlist: playlist,
                            room: room
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
                let scoreObjId = data.scoreObjId;
                socket.leave(roomId);
                Room.findById(roomId)
                    .then(room => {
                        return room.removeUser(userId, scoreObjId);
                    })
                    .then(updatedRoom => {
                        let playlist = updatedRoom.playlist;
                        io.in(updatedRoom._id).emit('updateRoom', {
                            room: updatedRoom,
                            playlist: playlist
                        });
                    });
            })
            //User enters room
        socket.on('userEntered', function(data) {
            let roomId = data.roomId;
            let userId = data.userId;
            socket.join(roomId);
            Room.findById(roomId)
                .then(room => {
                    return room.addUser(userId);
                })
                .then(updatedRoom => {
                    let playlist = updatedRoom.playlist;
                    io.in(updatedRoom._id).emit('updateRoom', {
                        room: updatedRoom,
                        playlist: playlist
                    });
                });
        })

        socket.on('messageAdded', function(payload) {
            let roomId = payload.roomId;
            let userName = payload.userName;
            let msg = payload.message;
            Room.findById(roomId)
            .then(room => {
                return room.addMsg(userName,msg)
            })
            .then(updatedRoom => {
                let playlist = updatedRoom.playlist;
                io.emit('updateRoom', {
                    room: updatedRoom,
                    playlist: playlist
                })
            })
        })
            //Add a song
        socket.on('songAdded', function(payload) {
            Room.findById(payload.roomId)
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
                        populate: [{
                            path: 'song',
                            model: 'Song'
                        }, {
                            path: 'submittedBy',
                            model: 'User'
                        }]
                    }
                })
                .then(function(updatedRoom) {
                    var playlist = updatedRoom.playlist;
                    io.in(updatedRoom._id).emit('updateRoom', {
                        room: updatedRoom,
                        playlist: playlist
                    });
                });
        })


        //Add a powerup
        socket.on('addPowerUp', function(payload) {
            var playlist = payload.playlist;
            var userId = payload.user;
            var roomId;
            Room.findOne({
                    playlist: playlist
                })
                .then(function(room) {
                    roomId = room._id;
                    return PowerupData.findOne({
                        room: room._id,
                        user: userId
                    })
                })
                .then(function(powerupData) {
                    return powerupData.addPowerup();
                })
                .then((updatedPowerups) => {
                    io.in(roomId).emit('updatePowerups', updatedPowerups)
                })
        })

        //Death stars powerup
        socket.on('multiPower', function(payload) {
            var user = payload.user;
            var room = payload.room;
            var strength = payload.strength;
            //Initialize array to track users effected by stars
            var effectedUsers = [];
            return SongData.find({
                    playlist: room.playlist._id,
                    submittedBy: {
                        $ne: user._id
                    }
                })
                .then(songDataArr => {
                    songDataArr.forEach(songDataDoc => {
                        songDataDoc.changeScore(strength);
                        //For each song that was hit with a death star, push that users' ID into the effected users array
                        effectedUsers.push(songDataDoc.submittedBy);
                    })
                })
                .then(() => {
                    return UserScore.find({
                        user: {
                            $ne: user._id
                        }
                    })
                })
                .then(userScoreArr => {
                    userScoreArr.forEach(userScoreDoc => {
                        //Count the number of instances of this user in the effectedUsers array and multiple that number by the strength of each death star
                        var scoreUpdate = effectedUsers.filter(userId => {
                            return userId = userScoreDoc.user;
                        }).length * strength;
                        userScoreDoc.changeScore(scoreUpdate);
                    })
                })
                .then(() => {
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
                                populate: [{
                                    path: 'song',
                                    model: 'Song'
                                }, {
                                    path: 'submittedBy',
                                    model: 'User'
                                }]
                            }
                        })
                })
                .then(updatedRoom => {
                    var playlist = updatedRoom.playlist;
                    io.in(updatedRoom._id).emit('updateRoom', {
                        room: updatedRoom,
                        playlist: playlist
                    });
                })
        })
    });

    return io;

};
