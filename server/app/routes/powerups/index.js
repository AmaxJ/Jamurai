'use strict';
var router = require('express').Router();
var Song = require('mongoose').model('Song');
var Room = require('mongoose').model('Room');
var PowerupData = require('mongoose').model('PowerupData');
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



// router.route('/:songId')
//     .get(function(req, res, next) {
//         Song.findById(req.params.songId)
//             .then(function(song) {
//                 res.json(song);
//             }).then(null, next);
//     })
//     .put(function(req, res, next) {
//         Song.findByIdAndUpdate(req.params.songId, req.body, {new: true}
//             )
//             .then(function(song) {
//                 res.status(204).json(song);
//             }).then(null, next);
//     });


router.route('/:playlistId/:userId')
    .post(function(req, res, next) {
            var playlistId = req.params.playlistId;
            var userId = req.params.userId;
            console.log(playlistId, userId)
            Room.findOne({playlist: playlistId})
            .then(function(room){
                return PowerupData.findOne({room: room._id, user: userId})
            })
            .then(function(powerupData){
                return powerupData.addPowerup();
            })
            .then((updatedPowerups)=> {
                console.log('Updated powerups?', updatedPowerups);
                res.status(201).send(updatedPowerups);
            })
            .then(null, next);
    });

