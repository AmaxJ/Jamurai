'use strict';
var router = require('express').Router();
var User = require('mongoose').model('User');
var Powerup = require('mongoose').model('PowerupData');
module.exports = router;

router.route('/')
	.get(function(req,res,next){
		User.find({})
		.then(function(user){
			res.json(user);
		})
		.then(null,next);
	})
	.post(function(req,res,next){
		User.create(req.body)
		.then(function(user){
			res.status(201).json(user);
		})
		.then(null,next);
	})

router.route('/:id')
	.get(function(req,res,next){
		// User.find({})
		User.findById(req.params.id)
		.then(function(user){
			res.json(user);
		})
		.then(null,next);
	})
	.put(function(req,res,next){
		var userId = req.params.id;
		var update = req.body;
		User.findByIdAndUpdate(userId, update, { 'new': true}).exec()
		.then(function(user){
			// res.status(201).send(user)
			return user.save()
		}).then(function(user){
			res.status(201).send(user)
		}).then(null,next)
	})

router.route('/:userId/:roomId/powerup')
	.get(function(req,res,next){
		Powerup.findOne({user: req.params.userId, room: req.params.roomId})
		.then(function(powerUps){
			res.json(powerUps);
		})
		.then(null,next);
	})
	
router.route('/:userId/powerup')
	.get(function(req, res, next) {
		User.findById(req.params.userId)
		.then(function(user){
			let powerups = user.powerups;
			res.status(200).json(powerups);
		})
		.then(null, next);
	})
	.put(function(req, res, next) {
		User.findOne({_id: req.params.userId})
		.then(function(user){
			User.savePowerup(req.body, user)
		})
		.then(null, next)
	})
