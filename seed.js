/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));
var Song = Promise.promisifyAll(mongoose.model('Song'));
var Room = Promise.promisifyAll(mongoose.model('Room'));

var seedUsers = function () {

    var users = [
        {
            email: 'testing@fsa.com',
            password: 'password'
        },
        {
            email: 'obama@gmail.com',
            password: 'potus'
        }
    ];

    return User.createAsync(users);

};

var seedSongs = function () {
    var songs = [
        {
            title: 'Kusanagi',
            artist: 'Odesza',
            album: 'In Return',
            youTubeId: 'I2mK-Ql9r1Y',
            totalUpVotes: 102,
            totalDownVotes: 72
        },
        {
            title: "It's Only",
            artist: 'Odesza',
            album: 'In Return',
            youTubeId: 'UW0vOum0mBM',
            totalUpVotes: 65,
            totalDownVotes: 35
        },
        {
            title: 'Awake',
            artist: 'Tycho',
            album: 'Awake',
            youTubeId: '6XJBDX3Z0BY',
            totalUpVotes: 123,
            totalDownVotes: 99
        },
        {
            title: 'Somebody Told Me',
            artist: 'The Killers',
            album: 'Hot Fuss',
            youTubeId: 'Y5fBdpreJiU',
            totalUpVotes: 232,
            totalDownVotes: 149
        },
        {
            title: 'By The Way',
            artist: 'Red Hot Chili Peppers',
            album: 'By The Way',
            youTubeId: 'JnfyjwChuNU',
            totalUpVotes: 209,
            totalDownVotes: 107
        },
        {
            title: 'Californication',
            artist: 'Red Hot Chili Peppers',
            album: 'Californication',
            youTubeId: 'YlUKcNNmywk',
            totalUpVotes: 87,
            totalDownVotes: 72
        },
        {
            title: 'Tennis Court (Flume Remix)',
            artist: 'Lorde',
            youTubeId: '8ATu1BiOPZA',
            totalUpVotes: 123,
            totalDownVotes: 72
        },
        {
            title: 'Drop the Game',
            artist: 'Flume and Chet Faker',
            youTubeId: '6vopR3ys8Kw',
            totalUpVotes: 87,
            totalDownVotes: 12
        },
        {
            title: 'Platoon',
            artist: 'Jungle',
            youTubeId: '9JkDzNOgO3U',
            totalUpVotes: 134,
            totalDownVotes: 33
        },
        {
            title: 'Electric Love(Oliver Remix)',
            artist: 'Platoon',
            youTubeId: 'O8t9NXvOmGc',
            totalUpVotes: 76,
            totalDownVotes: 29
        },
        {
            title: 'Clair de Lune',
            artist: 'Flight Facilities',
            youTubeId: 'Jcu1AHaTchM',
            totalUpVotes: 1234134,
            totalDownVotes: 2
        }
    ];
    
    return Song.createAsync(songs);
}

var seedRooms = function () {

    var rooms =[
        {
            creator: '022837257235',
            name: "Sean's 30th",
            location: "Greener Pastures (Sean's Yacht)",
            ambassadors: ['Nate Dog', 'Chief Kief', 'Joe']
        },
        {
            creator: '0234723571h114',
            name: 'Going Away Party for Denise',
            location: 'The Krusty Crab',
            ambassadors: ['SpongeBob', 'Britney']
        },
        {
            creator: '0202023441',
            name: 'Farewell Fullstack Party',
            location: 'probably somewhere in Brooklyn',
            ambassadors: ['Joe', 'Rafi']
        },
        {
            creator: '0232357235',
            name: "Diplo's Git Nasty Party",
            location: 'Top of the Empire State Builiding',
            ambassadors: ['Sean']
        },
        {
            creator: '09234235-2351',
            name: 'Superbowl XLVISZI Party',
            location: "Jim's Apartment",
            ambassadors: ['Rosco', 'Leon', 'Paco']
        }
    ]

    return Room.createAsync(rooms);
}

connectToDb.then(function () {
    Song.findAsync({}).then(function (songs) {
        if (songs.length === 0) {
            return seedSongs();
        } else {
            console.log(chalk.magenta('Seems to already be song data, exiting!'));
            process.kill(0);
        }
    })
    .then(function() {
        return seedRooms();
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    }).catch(function (err) {
        console.error(err);
        process.kill(1);
    });
});
