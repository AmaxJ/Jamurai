'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	artist: {
		type: String
	},
	album: {
		type: String
	},
	youTubeId: {
		type: String,
		required: true
	},
	youTubeChannel: {
		type: String
	},
	publishedAt: {
		type: String
	},
	thumbnails: {
		type: mongoose.Schema.Types.Mixed
	},
	totalUpVotes: {
		type: Number,
		required: true,
		default: 0
	},
	totalDownVotes: {
		type: Number,
		required: true,
		default: 0
	},
	totalScore: {
		type: Number,
        default: 0
	},
    roomsRequestedIn : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    }]
});

mongoose.model('Song',schema);
