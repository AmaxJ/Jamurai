var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var expect = require('chai').expect;
var mongoose = require('mongoose');
var Promise = require('bluebird');

// Require in all models.
require('../../../server/db/models');

var Playlist = mongoose.model('Playlist');
var Song = mongoose.model('Song');
var Room = mongoose.model('Room');

describe('Playlist model', function() {

    beforeEach('Establish DB connection', function(done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function(done) {
        clearDB(done);
    });

    it('should exist', function() {
        expect(Playlist).to.be.a('function');
    });

    it('addSong() should add a song to songs field', function(done) {
        var room;
        var song;
        Room.create({
                creator: "testCreator",
                name: "testRoom",
            })
            .then(function(newRoom) {
                room = newRoom;
                return Song.create({
                    title: 'Kusanagi',
                    artist: 'Odesza',
                    album: 'In Return',
                    youTubeId: 'I2mK-Ql9r1Y',
                    totalUpVotes: 102,
                    totalDownVotes: 72
                })
            })
            .then(function(newSong) {
                song = newSong
                return Playlist.create({
                    room : room._id
                });
            })
            .then(function(newPlaylist) {
                return Playlist.addSong(newPlaylist._id, song._id)
            })
            .then(function(playlist) {
                expect(playlist.songs.length).to.equal(1);
                done();
            })
    });
});
