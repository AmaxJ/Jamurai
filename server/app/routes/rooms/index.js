'use strict';
var router = require('express').Router();
var Room = require('mongoose').model('Room');
module.exports = router;

router.route('/')
	.get(function(req,res,next){
		Room.find({})
		.populate('users')
        .populate('playlists')
        .populate({
            path: 'playlists',
            model: 'Playlist',
            populate : {
                path : 'songs',
                model : 'Song'
            }
        })
		.exec()
		.then(function(rooms){
			res.json(rooms);
		})
		.then(null,next);
	})
	.post(function(req,res,next){
		Room.create(req.body)
		.then(function(room){
			res.status(201).json(room);
		})
		.then(null,next);
	})

router.route('/:roomId')
	.get(function(req,res,next){
		Room.findById(req.params.roomId)
		.populate('songs')
		.populate('users')
		.then(function(room){
			res.json(room);
		})
		.then(null,next);
	})
	.put(function(req,res,next){
		Room.findByIdAndUpdate(req.params.roomId,req.body, {new: true})
		.then(function(room){
			res.status(204).json(room);
		})
		.then(null,next);
	})
	.delete(function(req,res,next){
		Room.findByIdAndRemove(req.params.roomId)
		.exec()
		.then(function(room){
			res.status(204).end();
		})
		.then(null,next);
	})
