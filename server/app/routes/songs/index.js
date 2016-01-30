'use strict';
var router = require('express').Router();
var Song = require('mongoose').model('Song');
module.exports = router;

router.route('/')
    .get(function(req, res, next) {
        Song.find({})
            .then(function(songs) {
                res.json(songs);
            })
            .then(null, next);
    })
    .post(function(req, res, next) {
        Song.create(req.body)
            .then(function(song) {
                res.status(201).json(song);
            })
            .then(null, next);
    })

//route to query by youtube id
router.route('/yid/:youTubeId')
    .get(function(req, res, next) {
        Song.findOne({youTubeId: req.params.youTubeId})
            .then(function(song) {
                console.log(song);
                res.status(200).json(song);
            })
            .then(null, next);
    });
