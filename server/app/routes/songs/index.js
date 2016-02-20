'use strict';
let router = require('express').Router();
let Song = require('mongoose').model('Song');
module.exports = router;

router.route('/')
    .get((req, res, next) => {
        Song.find({})
            .then(songs => {
                res.json(songs);
            })
            .then(null, next);
    })
    .post((req, res, next) => {
        Song.create(req.body)
            .then(song => {
                res.status(201).json(song);
            })
            .then(null, next);
    })

router.route('/:songId')
    .get((req, res, next) => {
        Song.findById(req.params.songId)
            .then(song => {
                res.json(song);
            }).then(null, next);
    })
    .put((req, res, next) => {
        Song.findByIdAndUpdate(req.params.songId, req.body, {new: true}
            )
            .then(song => {
                res.status(204).json(song);
            }).then(null, next);
    });

router.route('/yid/:youTubeId')
    .get((req, res, next) => {
        Song.findOne({
                youTubeId: req.params.youTubeId
            })
            .then(song => {
                res.status(200).json(song);
            })
            .then(null, next);
    });