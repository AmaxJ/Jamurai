var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var expect = require('chai').expect;
var mongoose = require('mongoose');
var Promise = require('bluebird');

// Require in all models.
require('../../../server/db/models');

var Playlist = mongoose.model('Playlist');
var SongData = mongoose.model('SongData');
var Song = mongoose.model('Song');

// describe('Playlist model', function() {

//     beforeEach('Establish DB connection', function(done) {
//         if (mongoose.connection.db) return done();
//         mongoose.connect(dbURI, done);
//     });

//     afterEach('Clear test database', function(done) {
//         clearDB(done);
//     });

//     it('should exist', function() {
//         expect(Playlist).to.be.a('function');
//     });

//     it('addSong() should add a song to songs field', function(done) {
//         var songDataObj;
//         var song;
//         var playlistId;
//         Song.create({
//                 title: 'Kusanagi',
//                 artist: 'Odesza',
//                 album: 'In Return',
//                 youTubeId: 'I2mK-Ql9r1Y',
//                 totalUpVotes: 102,
//                 totalDownVotes: 72
//             })
//             .then(function(newSong) {
//                 song = newSong;
//                 return Playlist.create({})
//             })
//             .then(function(playlist) {
//                 playlistId = playlist._id;
//                 return playlist.addSong(song._id);
//             })
//             .then(function(playlist) {
//                 return SongData.findOne({playlist : playlistId})
//             })
//             .then(function(songData) {
//                 songDataObj = songData;
//                 return Playlist.findById(playlistId);
//             })
//             .then(function(playlist) {
//                 expect(songDataObj.playlist.toString()).to.equal(playlist._id.toString());
//                 expect(playlist.songs[0].toString()).to.equal(song._id.toString());
//                 done();
//             })
//             .then(null, console.error.bind(console));
//     });

//     it('updateSongValue() should update songs score', function(done) {
//         var song;
//         var playlistId;
//         Song.create({
//                 title: 'Kusanagi',
//                 artist: 'Odesza',
//                 album: 'In Return',
//                 youTubeId: 'I2mK-Ql9r1Y',
//                 totalUpVotes: 102,
//                 totalDownVotes: 72
//             })
//             .then(function(newSong) {
//                 song = newSong;
//                 return Playlist.create({})
//             })
//             .then(function(playlist) {
//                 playlistId = playlist._id;
//                 return playlist.addSong(song._id);
//             })
//             .then(function(songData) {
//                 return Playlist.findById(playlistId)
//             })
//             .then(function(playlist) {
//                 return playlist.updateSongValue(song._id, 4);
//             })
//             .then(function(songData) {
//                 expect(songData.total).to.equal(4);
//                 done();
//             })
//             .then(null, console.error.bind(console));
//     });
// });
