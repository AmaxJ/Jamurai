var path = require('path');
var DATABASE_URI = require(path.join(__dirname, './server/env')).DATABASE_URI;

var mongoose = require('mongoose');

mongoose.connect(DATABASE_URI, function() {

    mongoose.connection.db.dropCollection('capstone', function(err, result) {
        if (err) {
            console.log(err)
        } else {
            console.log("success: ", result)
        }
    });
});
