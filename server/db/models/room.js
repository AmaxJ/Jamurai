'use strict';
var mongoose = require('mongoose');
var UserScore = mongoose.model("UserScore");

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
    }]
});


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
    addUser: function(userId) {
        this.users.addToSet(userId);
        return this.save();
    },
    addToScore: function(songData, amount) {
        // UserScore.findOne({user:})
        // if (!this.userScores[userId]) {
        //     this.userScores[userId] = 0;
        // }
        // this.userScores[userId] += amount;
        // this.markModified('userScores');
        // return this.save();
    },
    subtractFromScore: function(userId, amount) {
        if (!this.userScores[userId]) {
            this.userScores[userId] = 0;
        }
        this.userScores[userId] -= amount;
        this.markModified('userScores');
        return this.save();
    }
});

mongoose.model('Room', schema);
