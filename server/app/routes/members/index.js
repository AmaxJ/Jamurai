'use strict';
let router = require('express').Router();
module.exports = router;
let _ = require('lodash');

let ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};
