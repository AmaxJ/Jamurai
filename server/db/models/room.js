'use strict';
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Song = mongoose.model('Song');

var schema = new mongoose.Schema({
    creator: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    privacy: {
        type: String
    },
    location: {
        type: String
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: User
    },
    songs: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: Song
    },
    roomMetadata: {
        type: mongoose.Schema.Types.Mixed
    }
});


schema.statics.getRoomUsers =  function getRoomUsers () {
    return this.find()
    .populate('users')
    .select('users')
    .exec()
};

schema.statics.getRoomSongs =  function getRoomSongs () {
    return this.find()
    .populate('songs')
    .select('songs')
    .exec()
};


mongoose.model('Room', schema);