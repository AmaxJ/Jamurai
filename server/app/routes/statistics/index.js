'use strict';
let Statistics = require('mongoose').model('Statistics');
let router = require('express').Router();
module.exports = router;

router.route('/')
    .get((req, res, next) => {
        Statistics.getLatest()
            .then(function(stats) {
                res.json(stats)
            })
            .then(null, next);
    });
