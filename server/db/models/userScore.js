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
    var self = this;
    var queryObj = {
        user: userId,
        room: roomId
    }
    return this.findOne(queryObj)
        .then(function(scoreObj) {
            if (!scoreObj) {
                return self.create(queryObj)
            }
            return scoreObj
        })
        .then(null, error => {
            console.log("Error in UserScore.findOrCreate:", error);
        });
}

schema.method({
    changeScore: function(amount) {
        this.score += amount;
        return this.save();
    }
});


mongoose.model('UserScore', schema);
