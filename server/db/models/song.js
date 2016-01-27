'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	title: {
		type: String
	},
	album: {
		type: String
	},
	metadata: Schema.type.mixed,
	totalVotes: {
		type: Number
	},
	totalScore: {
		type: Number
	}
});

mongoose.model('Song',schema);