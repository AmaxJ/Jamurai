'use strict'
let mongoose = require('mongoose');

let schema = new mongoose.Schema({
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
        let powerUps =['Lotus of Generosity', 'Sword of Ultimate Shame', 'Daggers of Disdain', 'Katana of Disgrace', 'Enlightened Blessing', 'Sword of Uncertainty', 'Poison Darts', 'The Last Jamurai'];
        
        let randomEngine = () => {
            let rando = +Math.floor(Math.random()*101);
            if (rando >= 0 && rando < 3) {
                return 'The Last Jamurai';
            }
            else if (rando > 2 && rando < 11) {
                return 'Sword of Ultimate Shame';
            }
            else if (rando > 10 && rando < 31) {
                return 'Lotus of Generosity';
            }
            else if (rando > 30 && rando < 41) {
                return 'Daggers of Disdain';
            }
            else if (rando > 40 && rando < 56) {
                return 'Katana of Disgrace';
            }
            else if (rando > 55 && rando < 76) {
                return 'Enlightened Blessing';
            }
            else if (rando > 75 && rando < 91) {
                return 'Sword of Uncertainty';
            }
            else if (rando > 90 && rando < 101) {
                return 'Poison Darts'
            }
        }
        this.powerups.push(randomEngine());
        return this.save();
    },
    usePowerup: function(powerUp) {
        let powerIndex = this.powerups.indexOf(powerUp);
        this.powerups.splice(powerIndex, 1);
        return this.save();
    }
});



mongoose.model('PowerupData', schema);
