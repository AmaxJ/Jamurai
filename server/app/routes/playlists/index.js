'use strict';
var router = require('express').Router();
var Playlist = require('mongoose').model('Playlist');
module.exports = router;

router.route('/')
    .get(function(req,res,next){
        Playlist.find({})
        .populate('songs')
        .exec()
        .then(function(playlist){
            res.json(playlist);
        })
        .then(null,next);
    })
    .post(function(req,res,next){
        Playlist.create(req.body)
        .then(function(playlist){
            res.status(201).json(playlist);
        })
        .then(null,next);
    })
