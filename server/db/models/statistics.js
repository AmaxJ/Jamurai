'use strict'
var _ = require('lodash');
var mongoose = require('mongoose');
var Song = mongoose.model('Song');

var schema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    topTenSongs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song"
    }],
    bottomTenSongs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song"
    }],
    popularByRoom: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song"
    }]
});


schema.statics.createNewDataSet = function() {
    var self = this;
    var topTen,
        bottomTen,
        mostRequested;

    var returnId = function(song) {
        return song._id };

    return Song.find({})
        .then(function(songs) {
            songs.sort(function(a, b) {
                return b.totalScore - a.totalScore;
            })
            topTen = songs.slice(0, 10).map(returnId);
            bottomTen = songs.slice(-10).map(returnId);
            songs.sort(function(a, b) {
                return b.numRoomsRequestedIn - a.numRoomsRequestedIn;
            });
            mostRequested = songs.slice(0, 10).map(returnId);

            return self.create({
                topTenSongs: topTen,
                bottomTenSongs: bottomTen,
                popularByRoom: mostRequested
            });
        })
        .then(function(newStatsObj) {
            return self.findById(newStatsObj._id)
                .populate("topTenSongs")
                .populate("bottomTenSongs")
                .populate("popularByRoom")
                .exec();
        })
        .then(null, function(err) {
            console.error("error with Statistics.createNewDataSet() :", err);
        })
}

schema.statics.getLatest = function() {
    var self = this;
    return self.find({})
        .sort({ date: -1 })
        .limit(1)
        .populate("topTenSongs")
        .populate("bottomTenSongs")
        .populate("popularByRoom")
        .exec()
        .then(function(stats) {
            if (stats.length === 0) return self.createNewDataSet();
            var timeSinceLastStat = Date.now() - stats[0].date;
            var twentyFourHours = 86400000;
            console.log("Time since last stat: ", timeSinceLastStat)
            if (timeSinceLastStat > twentyFourHours) {
                return self.createNewDataSet();
            }
            return stats[0];
        })
        .then(null, function(err) {
            console.log("error with statistics.getLatest() :", err);
        })
}


mongoose.model('Statistics', schema);
