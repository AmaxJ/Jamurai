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

// schema.statics.createAndAddToRoom = function(userId, roomId) {
//     var userScoreId;
//     this.create({
//         user : userId,
//         room : roomId
//     })
//     .then(function(userScoreObj) {
//         userScoreId = userScoreObj._id
//         return Room.findById(roomId);
//     })
//     .then(function(room) {
//         room.userScores.addToSet(userScoreId);
//         return room.save();
//     });
// };


mongoose.model('UserScore', schema);
