'use strict';
var mongoose = require('mongoose');
var UserScore = mongoose.model("UserScore");
var PowerupData = mongoose.model("PowerupData");

var schema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    location: {
        type: String
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    playlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist"
    },
    userScores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserScore"
    }],
    powerUps: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "PowerupData" 
    }]
});

schema.statics.createScoreObj = function(roomId, userId) {
    var savedRoom;
    this.findById(roomId)
        .then(function(room) {
            savedRoom = room;
            return UserScore.create({
                user: userId,
                room: roomId
            });
        })
        .then(function(scoreObj) {
            savedRoom.userScores.addToSet(scoreObj._id);
            return savedRoom.save();
        })


};

schema.statics.getRoomUsers = function getRoomUsers() {
    return this.find()
        .populate('users')
        .select('users')
        .exec()
};

schema.statics.getRoomSongs = function getRoomSongs() {
    return this.find()
        .populate('songs')
        .select('songs')
        .exec()
};

schema.method({
    addToScore: function(songData, amount) {
        var self = this;
        return UserScore.findOne({
                user: songData.submittedBy,
                room: self._id
            })
            .then(function(userScoreObj) {
                userScoreObj.score += amount;
                return userScoreObj.save();
            })
            .then(function(scoreObj) {
                return self.constructor.findById(self._id)
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
    },
    /* when a user is added, we check the userScore objects
    array on the room document. If there is already a
     userScore object for the user with that ID, we do
     nothing, otherwise create a new object*/
    addUser: function(userId) {
        let self = this;
        this.users.addToSet(userId);
        return this.save()
            .then((room) => {
                return this.constructor.findById(this._id)
                    .populate('users')
                    .populate('userScores');
            })
            .then(room => {
                //returns userscore obj if it exists
                let userScoreObj = room.userScores.filter(scoreObj => {
                    return scoreObj.user.toString() === userId.toString();
                })[0];
                if (!userScoreObj) {
                    return self.constructor.createScoreObj(self._id, userId);
                } else {
                    return "Already have a score Obj"
                }
            })
            .then(function(scoreObj){
                return self.addPowerupData(userId);
            })
            .then(function(powerUp) {
                return self.constructor.findById(self._id)
                    .populate('users')
                    .populate('userScores')
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
    },
    removeUser: function(userId) {
        this.users.pull(userId);
        return this.save()
            .then((room) => {
                return this.constructor.findById(this._id).populate('users');
            });
    },
    addPowerupData: function(userId) {
        return PowerupData.create({user: userId, room: this._id})
    }
});

mongoose.model('Room', schema);
