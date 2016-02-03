'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var _ = require('lodash');
var rp = require('request-promise');

var schema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    location: {
        type: String
    },
    coordinates: {
        type: [Number]
    },
    normalizedLocation: {
        type: String
    },
    DOB: {
        type: String
    },
    age: {
        type: Number
    },
    salt: {
        type: String
    },
    dateCreation: {
        type: Date,
        default: Date.now
    },
    twitter: {
        id: String,
        username: String,
        token: String,
        tokenSecret: String
    },
    facebook: {
        id: String
    },
    google: {
        id: String
    },
    experience: {
        type: Number
    },
    rank: {
        type: Number
    },
    picture: {
        type: String
    }
});

// method to remove sensitive information from user objects before sending them out
schema.methods.sanitize =  function () {
    return _.omit(this.toJSON(), ['password', 'salt']);
};

// generateSalt, encryptPassword and the pre 'save' and 'correctPassword' operations
// are all used for local authentication security.
var generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (plainText, salt) {
    var hash = crypto.createHash('sha1');
    hash.update(plainText);
    hash.update(salt);
    return hash.digest('hex');
};

schema.pre('save', function (next) {

    if (this.isModified('password')) {
        this.salt = this.constructor.generateSalt();
        this.password = this.constructor.encryptPassword(this.password, this.salt);
    }
    var doc = this;
    if(this.location)
    {
        console.log('boom');
        var url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+this.location+'&key=AIzaSyBOwi-4AsRFS8G0SYIAv5ysZpGU-LnOpgY';
        return rp(url)
        .then(function(htmlString){
            // console.log('string',htmlString);
            var objHtml = JSON.parse(htmlString);
            // console.log('rez1',objHtml.results[0].geometry.bounds);
            // console.log('rez2',objHtml.results[1].geometry.bounds);
            var sumNELat = 0;
            var sumNELong = 0;
            var sumSWLat = 0;
            var sumSWLong = 0;
            // if(objHtml.results.length>0)
            // {
                if(objHtml.results.length>0)
                {
                    for(var x=0; x<objHtml.results.length; x++)
                    {
                        sumNELat+= objHtml.results[x].geometry.bounds.northeast.lat;
                        sumNELong+= objHtml.results[x].geometry.bounds.northeast.lng;
                        sumSWLat += objHtml.results[x].geometry.bounds.southwest.lat;
                        sumSWLong += objHtml.results[x].geometry.bounds.southwest.lng;
                    }
                    var avgNELat = sumNELat/objHtml.results.length;
                    var avgNELong = sumNELong/objHtml.results.length;
                    var avgSWLat = sumSWLat/objHtml.results.length;
                    var avgSWLong = sumSWLong/objHtml.results.length;
                    var lat = (avgNELat+avgSWLat)/2;
                    var lng = (avgNELong+avgSWLong)/2;
                    doc.coordinates = [lat,lng];
                    // console.log('coords',this.coordinates);
                    return doc.coordinates;
                }
                else
                {
                    next();
                }
                
            // }
        })
        .then(function(coords) {
            // console.log('coords',coords);
            var url2 = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+coords[0]+','+coords[1]+'&key=AIzaSyBOwi-4AsRFS8G0SYIAv5ysZpGU-LnOpgY';
            return rp(url2)
        })
        .then(function(results) {
            var objRes = JSON.parse(results);
            // console.log('obj',objRes.results[0].address_components);
            for(var y=0; y<objRes.results[0].address_components.length; y++)
            {
                // console.log('yo',objRes.results[0].address_components[y].types);

                var typeArr = objRes.results[0].address_components[y].types;
                var useThisForCity = false;
                var useThisForState = false;
                for(var z=0; z<typeArr.length; z++)
                {
                    if(typeArr[z]==='sublocality_level_1')
                    {
                        useThisForCity = true;
                        break;
                    }
                    else if(typeArr[z]==='locality')
                    {
                        useThisForCity = true;
                        break;
                    }
                    else if(typeArr[z]==='administrative_area_level_1')
                    {
                        useThisForState = true;
                        break;
                    }
                }
                if(useThisForCity)
                {
                    var city = objRes.results[0].address_components[y].long_name;
                }
                else if(useThisForState)
                {
                    var state = objRes.results[0].address_components[y].short_name;
                }
            }
            var normalizedLocationString = city+', '+state;
            doc.normalizedLocation = normalizedLocationString;
            var bday = Date.parse(doc.DOB);
            console.log('DOB',bday);
            var today = new Date();
            var todayYear = today.getYear();
            var todayMonth = today.getMonth().toString();
            var todayDate = today.getDate().toString();
            var todayMonthDate = Number(todayMonth.concat(todayDate))
            if(bday)
            {
                var bdayDate = new Date(bday);
                var bdayMonth = bdayDate.getMonth().toString();
                var bdayDay = bdayDate.getDate().toString();
                var bdayYear = bdayDate.getYear();
                var bdayMonthDate = Number(bdayMonth.concat(bdayDay));
                // console.log('real DOB', monthDate);
                var age = todayYear - bdayYear;
                if(bdayMonthDate > todayMonthDate)
                {
                    age--;
                }
                doc.age = age;
            }
            // }
            next();
        })
    }
    next();
    

});

schema.statics.generateSalt = generateSalt;
schema.statics.encryptPassword = encryptPassword;

schema.method('correctPassword', function (candidatePassword) {
    return encryptPassword(candidatePassword, this.salt) === this.password;
});

mongoose.model('User', schema);