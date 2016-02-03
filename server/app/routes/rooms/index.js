'use strict';
var router = require('express').Router();
var Room = require('mongoose').model('Room');
var Playlist = require('mongoose').model('Playlist')
module.exports = router;

router.route('/')

    .get((req, res, next) => {
        Room.find({})
            .populate('users')
            .populate('creator')
            .populate({
                path: 'playlist',
                model: 'Playlist',
                populate: {
                    path: 'songs',
                    model: 'Song'
                }
            })
            .then(rooms => {
                res.json(rooms);
            })
            .then(null, next);
    })
    .post((req, res, next) => {
        let playlist;
        Playlist.create({})
            .then(newPlaylist => {
                req.body.playlist = newPlaylist;
                return Room.create(req.body)
            })
            .then(room => {
                res.status(201).json(room);
            })
            .then(null, next);
    })


router.route('/:roomId')
    .get((req, res, next) => {
        Room.findById(req.params.roomId)
            .populate('songs')
            .populate('users')
            .populate('creator')
            .populate({
                path: 'playlists',
                model: 'Playlist',
                populate: {
                    path: 'songs',
                    model: 'Song'
                }
            })
            .then(room => {
                res.json(room);
            })
            .then(null, next);
    })
    .put((req, res, next) => {
        Room.findByIdAndUpdate(req.params.roomId, req.body, {
                new: true
            })
            .then(room => {
                res.status(204).json(room);
            })
            .then(null, next);
    })

    .delete((req, res, next) => {
        Room.findByIdAndRemove(req.params.roomId)
            .exec()
            .then(room => {
                res.status(204).end();
            })
            .then(null, next);
    });


router.route('/addUser/:roomId')
    .put((req, res, next) => {
        Room.findById(req.params.roomId)
        .then((room) => {
            return room.addUser(req.body.userId)
        })
        .then((room) => {
            console.log('add', room);
            res.status(204).json(room)
        })
        .then(null, next)
    })

router.route('/removeUser/:roomId')
    .put((req, res, next) => {
        Room.findById(req.params.roomId)
        .then((room) => {
            return room.removeUser(req.body.userId)
        })
        .then((room) => {
            console.log('remove', room);
            res.status(204).json(room)
        })
        .then(null, next)
    })
