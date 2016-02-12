'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/members', require('./members'));
router.use('/songs', require('./songs'));
router.use('/rooms', require('./rooms'));
router.use('/playlists', require('./playlists'));
router.use('/users', require('./users'));
router.use('/powerups', require('./powerups'));


// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
