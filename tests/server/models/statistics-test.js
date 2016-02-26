var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var expect = require('chai').expect;
var mongoose = require('mongoose');
var Promise = require('bluebird');

// Require in all models.
require('../../../server/db/models');

var Statistics = mongoose.model('Statistics');
var Song = Promise.promisifyAll(mongoose.model('Song'));

describe('Statistics model', function() {
    var allsongs;

    beforeEach('Establish DB connection', function(done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    beforeEach('Create songs', function(done) {
        Song.createAsync([{
            title: 'Awake',
            artist: 'Tycho',
            album: 'Awake',
            youTubeId: '6XJBDX3Z0BY',
            totalScore: 5,
            numRoomsRequestedIn: 1
        }, {
            title: 'Somebody Told Me',
            artist: 'The Killers',
            album: 'Hot Fuss',
            youTubeId: 'Y5fBdpreJiU',
            totalScore: 2,
            numRoomsRequestedIn: 3
        }, {
            title: 'By The Way',
            artist: 'Red Hot Chili Peppers',
            album: 'By The Way',
            youTubeId: 'JnfyjwChuNU',
            totalScore: -2,
            numRoomsRequestedIn: 10
        }])
        .then(function(songs) {
            allsongs = songs;
            done();
        })
    })

    afterEach('Clear test database', function(done) {
        clearDB(done);
    });

    it('should exist', function() {
        expect(Statistics).to.be.a('function');
    });

    it('createNewDataSet() should create a new dataSet', function(done) {
        Statistics.createNewDataSet()
            .then(function(dataset) {
                expect(dataset.topTenSongs).to.have.length(3);
                expect(dataset.bottomTenSongs).to.have.length(3);
                expect(dataset.popularByRoom).to.have.length(3);
                done();
            })
            .then(null, console.error.bind(console));
    });

    it('getLatest() returns last dataset if less than 24 hours has passed', function (done) {
        var data;
        Statistics.createNewDataSet()
            .then(function(dataset) {
                data = dataset;
                return Statistics.getLatest();
            })
            .then(function(dataset) {
                expect(dataset._id.toString()).to.equal(data._id.toString());
                done();
            })
            .then(null, console.error.bind(console));
    });

    it('getLatest() creates a new dataset if more than 24 hours have passed', function (done) {
        var data;
        var date = new Date();
        date.setDate(date.getDate() - 2);
        Statistics.create({date: date})
            .then(function(dataset) {
                data = dataset;
                return Statistics.getLatest();
            })
            .then(function(dataset) {
                expect(dataset._id.toString()).to.not.equal(data._id.toString());
                done();
            })
    })


});
