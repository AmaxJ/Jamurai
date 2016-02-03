'use strict'
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    score: {
        type: Number,
        default: 0
    },
    room : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    }
});

schema.method({});


mongoose.model('UserScore', schema);
