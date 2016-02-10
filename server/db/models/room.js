'use strict';
var mongoose = require('mongoose');
var UserScore = mongoose.model("UserScore");
var PowerupData = mongoose.model("PowerupData");
var rp = require('request-promise');

var schema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    coords: {
        type: [Number],
    },
    initiated: {
        type: Boolean,
        default: false
    },
    location: {
        type: String
    },
    normalLocation: {
        type: String
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    playlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist"
    },
    userScores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserScore"
    }],
    powerUps: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "PowerupData" 
    }]
});

schema.statics.createScoreObj = function(roomId, userId) {
    var savedRoom;
    this.findById(roomId)
        .then(function(room) {
            savedRoom = room;
            return UserScore.create({
                user: userId,
                room: roomId
            });
        })
        .then(function(scoreObj) {
            savedRoom.userScores.addToSet(scoreObj._id);
            return savedRoom.save();
        })


};

schema.statics.getRoomUsers = function getRoomUsers() {
    return this.find()
        .populate('users')
        .select('users')
        .exec()
};

schema.statics.getRoomSongs = function getRoomSongs() {
    return this.find()
        .populate('songs')
        .select('songs')
        .exec()
};

var getNormLoc = function(doc,coords) {
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+coords[0]+','+coords[1]+'&key=AIzaSyBOwi-4AsRFS8G0SYIAv5ysZpGU-LnOpgY';
    return rp(url)
    .then(function(results) {
        var objRes = JSON.parse(results);
        if(objRes.results.length > 0)
        {   
            for(var y=0; y<objRes.results[0].address_components.length; y++)
            {
                var typeArr = objRes.results[0].address_components[y].types;
                var sublocality = typeArr.indexOf('sublocality_level_1');
                var locality = typeArr.indexOf('locality');
                var adminArea = typeArr.indexOf('administrative_area_level_1');

                if(sublocality >= 0 || locality >= 0)
                {
                    var city = objRes.results[0].address_components[y].long_name;
                }

                else if(adminArea >= 0)
                {
                    var state = objRes.results[0].address_components[y].short_name;
                }
            }
            var normalizedLocationString = city+', '+state;
            return [doc,normalizedLocationString];
        }
        else
        {
            return;
        }
        
    })
}

schema.method({
    addToScore: function(songData, amount) {
        var self = this;
        return UserScore.findOne({
                user: songData.submittedBy,
                room: self._id
            })
            .then(function(userScoreObj) {
                userScoreObj.score += amount;
                return userScoreObj.save();
            })
            .then(function(scoreObj) {
                return self.constructor.findById(self._id)
                    .populate('users')
                    .populate({
                        path: 'userScores',
                        model: 'UserScore',
                        populate: {
                            path: "user",
                            model: "User"
                        }
                    })
                    .populate({
                        path: 'playlist',
                        model: 'Playlist',
                        populate: {
                            path: 'songs',
                            model: 'SongData',
                            populate: {
                                path: 'song',
                                model: 'Song'
                            }
                        }
                    })
            })
    },
    /* when a user is added, we check the userScore objects
    array on the room document. If there is already a
     userScore object for the user with that ID, we do
     nothing, otherwise create a new object*/
    addUser: function(userId) {
        let self = this;
        this.users.addToSet(userId);
        return this.save()
            .then((room) => {
                return this.constructor.findById(this._id)
                    .populate('users')
                    .populate('userScores');
            })
            .then(room => {
                //returns userscore obj if it exists
                let userScoreObj = room.userScores.filter(scoreObj => {
                    return scoreObj.user.toString() === userId.toString();
                })[0];
                if (!userScoreObj) {
                    return self.constructor.createScoreObj(self._id, userId);
                } else {
                    return "Already have a score Obj"
                }
            })
            .then(function(scoreObj){
                return self.addPowerupData(userId);
            })
            .then(function(powerUp) {
                return self.constructor.findById(self._id)
                    .populate('users')
                    .populate('userScores')
                    .populate({
                        path: 'userScores',
                        model: 'UserScore',
                        populate: {
                            path: "user",
                            model: "User"
                        }
                    })
                    .populate({
                        path: 'playlist',
                        model: 'Playlist',
                        populate: {
                            path: 'songs',
                            model: 'SongData',
                            populate: {
                                path: 'song',
                                model: 'Song'
                            }
                        }
                    })
            })
            .then(function(doc){
                if(doc.users.length > 5)
                {
                    doc.initiated = true;
                }
                if(!doc.initiated)
                {
                    var coordArr = [0,0]
                    for(var x=0; x<self.users.length; x++)
                    {
                        coordArr[0]+=doc.users[x].coordinates[0];
                        coordArr[1]+=doc.users[x].coordinates[1];
                    }
                    coordArr[0] = coordArr[0]/doc.users.length;
                    coordArr[1] = coordArr[1]/doc.users.length;
                    doc.coords = coordArr;
                    return getNormLoc(doc,doc.coords)
                }
                else
                {
                    return;
                }
            })
            .then(function(returnData){
                var doc = returnData[0];
                var normLoc = returnData[1];
                doc.normalLocation = normLoc;
                return doc.save();
            })
    },
    removeUser: function(userId) {
        this.users.pull(userId);
        return this.save()
            .then((room) => {
                return this.constructor.findById(this._id).populate('users');
            });
    },
    addPowerupData: function(userId) {
        PowerupData.findOne({user: userId, room: this._id})
        .then(powerupData => {
            if(!powerupData) {
                return PowerupData.create({user: userId, room: this._id})
                .then(powerupData=> {
                        self.powerUps.push(powerupData);
                        self.save();
                     })
            }
            else {
                return "Already have a power up Obj"
            }
        })

    },
    removeSongFromPlaylist: function(song) {
        console.log('SONG TO REMOVE', song);
        // var index = this.playlist.indexOf(song);
        // this.playlist.splice(index, 1);
        // this.save;
    }
});

mongoose.model('Room', schema);
