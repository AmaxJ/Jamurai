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
            let rando = +Math.floor(Math.random()*861);
            if (rando >= 0 && rando < 21) {
                return 'The Last Jamurai';
            }
            else if (rando > 20 && rando < 91) {
                return 'Sword of Ultimate Shame';
            }
            else if (rando > 90 && rando < 241) {
                return 'Lotus of Generosity';
            }
            else if (rando > 240 && rando < 341) {
                return 'Daggers of Disdain';
            }
            else if (rando > 340 && rando < 451) {
                return 'Katana of Disgrace';
            }
            else if (rando > 450 && rando < 621) {
                return 'Enlightened Blessing';
            }
            else if (rando > 620 && rando < 761) {
                return 'Sword of Uncertainty';
            }
            else if (rando > 760 && rando < 861) {
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
