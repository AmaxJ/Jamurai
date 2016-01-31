var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));
var Song = Promise.promisifyAll(mongoose.model('Song'));
var Room = Promise.promisifyAll(mongoose.model('Room'));
<<<<<<< HEAD
=======
var Playlist = Promise.promisifyAll(mongoose.model('Playlist'));
>>>>>>> master

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

var songIds;
var userId;

connectToDb.then(function () {
    Song.findAsync({}).then(function (songs) {
        if (songs.length > 0) Song.remove({}).exec();
        return seedSongs();
    })
    .then(function (songs) {
        songIds = songs.map(function(song) {
            return song._id;
        });
        return User.create({
            email : "test@gmail.com",
            password : "test"
        });
    })
    .then(function (user) {
        userId = user._id;
        return Playlist.create({
            songs : songIds
        });
    })
    .then(function (playlist) {
        return Room.create({
            creator : userId,
            name : "room!",
            playlists : [playlist._id]
        });
    })
    .then(function (room) {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    })
    .catch(function (err) {
        console.error(err);
        process.kill(1);
    });
});
