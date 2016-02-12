'use strict';
var router = require('express').Router();
var Song = require('mongoose').model('Song');
var Room = require('mongoose').model('Room');
var PowerupData = require('mongoose').model('PowerupData');
var User = require('mongoose').model('User');
module.exports = router;

router.route('/:userId/:roomId')
    .get(function(req, res, next) {
        var userId = req.params.userId;
        var roomId = req.params.roomId;
        PowerupData.findOne({user: userId, room: roomId})
            .then(function(powerups) {
                res.json(powerups);
            })
            .then(null, next);
    })


router.route('/:playlistId/:userId')
    .post(function(req, res, next) {
            var playlistId = req.params.playlistId;
            var userId = req.params.userId;
            Room.findOne({playlist: playlistId})
            .then(function(room){
                return PowerupData.findOne({room: room._id, user: userId})
            })
            .then(function(powerupData){
                return powerupData.addPowerup();
            })
            .then((updatedPowerups)=> {
                res.status(201).send(updatedPowerups);
            })
            .then(null, next);
    });

router.route('/use-powerup/:userId/:roomId/')
    .post(function(req, res, next) {
        var userId = req.params.userId;
        var roomId = req.params.roomId;
        var powerup = req.body.powerup;

        User.findOne({_id: userId})
        .then(function(user){
            User.savePowerup(powerup, user)
        })

        PowerupData.findOne({user: userId, room: roomId})
            .then((powerupData) =>{
                return powerupData.usePowerup(powerup);
            })
            .then(function(powerups) {
                res.json(powerups);
            })
            .then(null, next);
    })

