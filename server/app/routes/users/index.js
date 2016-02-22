'use strict';
let router = require('express').Router();
let User = require('mongoose').model('User');
let Powerup = require('mongoose').model('PowerupData');
module.exports = router;

router.route('/')
	.get((req,res,next)=>{
		User.find({})
		.then(user => {
			res.json(user);
		})
		.then(null,next);
	})
	.post((req,res,next) =>{
		User.create(req.body)
		.then(user => {
			res.status(201).json(user);
		})
		.then(null,next);
	})

router.route('/:id')
	.get((req,res,next) => {
		User.findById(req.params.id)
		.then(user => {
			res.json(user);
		})
		.then(null,next);
	})
	.put((req,res,next) => {
		let userId = req.params.id;
		let update = req.body;
		User.findByIdAndUpdate(userId, update, { 'new': true}).exec()
		.then(user => {
			return user.save()
		}).then(user => {
			res.status(201).send(user)
		}).then(null,next)
	})

router.route('/:userId/:roomId/powerup')
	.get((req,res,next) => {
		Powerup.findOne({user: req.params.userId, room: req.params.roomId})
		.then(powerUps => {
			res.json(powerUps);
		})
		.then(null,next);
	})
	
router.route('/:userId/powerup')
	.get((req, res, next) => {
		User.findById(req.params.userId)
		.then(user => {
			let powerups = user.powerups;
			res.status(200).json(powerups);
		})
		.then(null, next);
	})