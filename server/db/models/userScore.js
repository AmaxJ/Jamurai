'use strict'
var mongoose = require('mongoose');
var SongData = mongoose.model("SongData");

var schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    score: {
        type: Number,
        default: 0
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    }
});

schema.statics.findOrCreate = function(userId, roomId) {
    var queryObj = {
        user: userId,
        room: roomId
    }
    return this.findOne(queryObj)
        .then(function(scoreObj) {
            if (!scoreObj) {
                return ScoreObj.create(queryObj)
            }
            return scoreObj
        });
}

schema.method({
    changeScore: function(amount) {
        this.score += amount;
        return this.save();
    }
});



mongoose.model('UserScore', schema);
