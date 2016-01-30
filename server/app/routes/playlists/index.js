'use strict';
let router = require('express').Router();
let Playlist = require('mongoose').model('Playlist');
module.exports = router;

router.route('/')
    .get((req, res, next) => {
        Playlist.find({})
            .populate('songs')
            .exec()
            .then(playlist => {
                res.json(playlist);
            })
            .then(null, next);
    })
    .post((req, res, next) => {
        Playlist.create(req.body)
            .then(playlist => {
                res.status(201).json(playlist);
            })
            .then(null, next);
    });

router.route('/:playlistId')
    .get((req, res, next) => {
        Playlist.findById(req.params.playlistId)
            .populate('songs')
            .exec()
            .then(playlist => {
                res.status(200).json(playlist);
            })
            .then(null, next);
    })
    .put((req, res, next) => {
        Playlist.findById(req.params.playlistId)
            .then(playlist => {
                return playlist.addSong(req.body.song._id);
            })
            .then( playlist => {
                res.status(204).json(playlist);
            })
            .then(null, next);
    });
