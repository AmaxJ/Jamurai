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
        ref: "User",
        default: []
    }],

    downVotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],

    total : {
        type: Number,
        default: 0
    },

    submittedBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

});

schema.method({
    calculateValue : function() {
        this.total = this.upVotes.length - this.downVotes.length;
        return this.save();
    },
    vote : function(userId, vote) { //vote = 'up' or 'down'
        if (!userId || !vote) return;
        if (vote === 'up') {
            if (this.upVotes.indexOf(userId) > -1) return;
            cleanVotes(userId,vote, this);
            this.upVotes.push(userId);
        } else if (vote === 'down') {
            if (this.downVotes.indexOf(userId) > -1) return;
            cleanVotes(userId,vote, this);
            this.downVotes.push(userId);
        }
        this.total = this.upVotes.length - this.downVotes.length;
        return this.save();
    },
    removeVote: function(userId, vote) {
        if (!userId) return;
        if (vote) {
            var voteProp = vote + "Votes";
            var userIndex = this[voteProp].indexOf(userId);
            this[voteProp].splice(userIndex, 1);
        }
        return this.save();
    }
});

function cleanVotes(userId, vote, doc) {
    var index;
    if (vote === 'up') {
        index = doc.downVotes.indexOf(userId);
        if (index > -1) doc.downVotes.splice(index, 1)
    } else {
        index = doc.upVotes.indexOf(userId);
        if (index > -1) doc.upVotes.splice(index, 1)
    }
}

mongoose.model('SongData', schema);
