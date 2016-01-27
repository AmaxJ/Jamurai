// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var Room = mongoose.model('Room');
var User = mongoose.model('User');
var Song = mongoose.model('Song');
var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');
var db;

describe('Rooms Route', function() {
   before('Establish DB connection', function(done){
       if(!mongoose.connection.db) mongoose.connect(dbURI, done);
       done();
   });

   beforeEach('Seed sample data', function(done) {
      User.create({
        email: 'properTestEmail@email.email'
      })
      .then(function(user){
        return Room.create({
           creator: 'God',
           name: 'D-Block',
           privacy: 'Public',
           location: 'Yonkers',
           users: [user['_id']]
       })
      })
       
       .then(function() {
           done();
       });
   });

   afterEach('Clear test database', function(done) {
     clearDB(done);
   });

   describe('Get /api/rooms', function() {
       var guestAgent;

       beforeEach('Create guest agent', function() {
           guestAgent = supertest.agent(app);
       });

       it('should get a 200 response', function(done) {
           guestAgent.get('/api/rooms/')
           .expect(200)
           .end(done);
       });

       it('should find some rooms', function(done) {
           guestAgent.get('/api/rooms/').expect(200)
           .end(function(err, response) {
               if(err) return done(err);
               expect(response.body[0].creator).to.equal('God')
               done()
           });
       });
   });
})