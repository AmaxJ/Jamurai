'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({

    playlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist"
    },

    song: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song"
    },

    upVotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    downVotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    total : {
        type: Number,
        default: 0
    }

});

schema.method({
    calculateValue : function() {
        this.total = this.upVotes - this.downVotes;
        return this.save();
    }
});

mongoose.model('SongData', schema);
