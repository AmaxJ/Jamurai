'use strict';
var mongoose = require('mongoose');

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
    playlists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist"
    }],
    roomMetadata: {
        type: mongoose.Schema.Types.Mixed
    }
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
        console.log(userId);
        this.users.addToSet(userId);
        return this.save()
                .then((room) => {
                    return this.constructor.findById(this._id).populate('users');
                });
    },
    removeUser: function(userId) {
        this.users.pull(userId);
        return this.save()
                .then((room) => {
                    return this.constructor.findById(this._id).populate('users');
                });
    }
});

mongoose.model('Room', schema);
