'use strict'
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    powerups: {
        type: [String],
        default: []
    },
    room : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    }
});

schema.method({
    addPowerup : function() {
        var powerUps =['Chopsticks of Plenty', 'Sword of Ultimate Shame', 'Daggers of Disdain', 'Katana of Disgrace', 'Enlightened Blessing', 'Sword of Uncertainty', 'Poison Darts', 'The Last Jamurai'];
        var randomPowerUp = powerUps[Math.floor(Math.random()*powerUps.length)];
        this.powerups.push(randomPowerUp);
        return this.save();
    },
    usePowerup: function(powerUp) {
        var powerIndex = this.powerups.indexOf(powerUp);
        this.powerups.splice(powerIndex, 1);
        return this.save();
    }
});



mongoose.model('PowerupData', schema);
