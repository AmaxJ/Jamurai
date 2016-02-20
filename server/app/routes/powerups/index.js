'use strict';
let router = require('express').Router();
let Song = require('mongoose').model('Song');
let Room = require('mongoose').model('Room');
let PowerupData = require('mongoose').model('PowerupData');
let User = require('mongoose').model('User');
module.exports = router;

router.route('/:userId/:roomId')
    .get(function(req, res, next) {
        let userId = req.params.userId;
        let roomId = req.params.roomId;
        PowerupData.findOne({user: userId, room: roomId})
            .then(function(powerups) {
                res.json(powerups);
            })
            .then(null, next);
    })


router.route('/:playlistId/:userId')
    .post((req, res, next) => {
            let playlistId = req.params.playlistId;
            let userId = req.params.userId;
            Room.findOne({playlist: playlistId})
            .then(room => {
                return PowerupData.findOne({room: room._id, user: userId})
            })
            .then(powerupData => {
                return powerupData.addPowerup();
            })
            .then(updatedPowerups => {
                res.status(201).send(updatedPowerups);
            })
            .then(null, next);
    });

router.route('/use-powerup/:userId/:roomId/')
    .post((req, res, next) => {
        let userId = req.params.userId;
        let roomId = req.params.roomId;
        let powerup = req.body.powerup;

        User.findOne({_id: userId})
        .then(user => {
            User.savePowerup(powerup, user)
        })

        PowerupData.findOne({user: userId, room: roomId})
            .then(powerupData =>{
                return powerupData.usePowerup(powerup);
            })
            .then(powerups => {
                res.json(powerups);
            })
            .then(null, next);
    })

