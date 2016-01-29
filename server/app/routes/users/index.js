'use strict';
var router = require('express').Router();
var User = require('mongoose').model('User');
module.exports = router;

router.route('/')
	// .get(function(req,res,next){
	// 	User.find({})
	// 	.then(function(user){
	// 		res.json(user);
	// 	})
	// 	.then(null,next);
	// })
	.post(function(req,res,next){
		User.create(req.body)
		.then(function(user){
			res.status(201).json(user);
		})
		.then(null,next);
	})

router.route('/:id')
	// .get(function(req,res,next){
	// 	User.find({})
	// 	.then(function(user){
	// 		res.json(user);
	// 	})
	// 	.then(null,next);
	// })
	.put(function(req,res,next){
		var userId = req.params.id;
		var update = req.body;
		User.findByIdAndUpdate(userId, update, { 'new': true}).exec()
		.then(function(user){
			res.status(201).send(user)
		})
	})