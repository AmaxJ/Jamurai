'use strict'
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    powerups: {
        type: [String]
    },
    room : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    }
});

schema.method({
    addPowerup : function() {
        var powerUps =['superVote', 'resetSong'];
        var randomPowerUp = powerUps[Math.floor(Math.random()*powerUps.length)];
        this.powerups.push(randomPowerUp);
        return this.save();
    }
});



mongoose.model('PowerupData', schema);
