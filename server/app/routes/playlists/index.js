'use strict';
let router = require('express').Router();
let Playlist = require('mongoose').model('Playlist');
let SongData = require('mongoose').model('SongData');
module.exports = router;

router.route('/')
    .get((req, res, next) => {
        Playlist.find({})
            .populate({
                path: 'songs',
                model: 'SongData',
                populate: {
                    path: 'song',
                    model: 'Song'
                }
            })
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
            .populate({
                path: 'songs',
                model: 'SongData',
                populate: {
                    path: 'song',
                    model: 'Song'
                }
            })
            .exec()
            .then(playlist => {
                res.status(200).json(playlist);
            })
            .then(null, next);
    })
    .put((req, res, next) => {
        Playlist.findById(req.params.playlistId)
            .then(playlist => {
                return playlist.addSong(req.body.song._id, req.body.user);
            })
            .then(playlist => {
                res.status(204).json(playlist);
            })
            .then(null, next);
    });

router.route('/:playlistId/score')
    .put((req, res, next) => {
        Playlist.findById(req.params.playlistId)
            .then(playlist => {
                return playlist.updateSongValue(req.body.song._id, req.body.songValue);
            })
            .then(playlist => {
                res.status(204).json(playlist);
            })
            .then(null, next);
    });

router.route('/:playlistId/songData')
    .get((req, res, next) => {
        SongData.find({ playlist: req.params.playlistId })
            .populate('song')
            .then(songDataObjs => {
                res.json(songDataObjs);
            })
            .then(null, next);
    });

router.route('/:playlistId/:songId')
    .delete((req, res, next) => {
        Playlist.findById(req.params.playlistId)
            .then(playlist => {
                return playlist.removeSong(req.params.songId);
            })
            .then(playlist => {
                res.status(204).json(playlist);
            })
            .then(null, next);
    });
