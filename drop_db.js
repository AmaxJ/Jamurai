var path = require('path');
var DATABASE_URI = require(path.join(__dirname, './server/env')).DATABASE_URI;

var mongoose = require('mongoose');

mongoose.connect(DATABASE_URI, function() {
    mongoose.connection.db.dropDatabase(function(err, result) {
        if (err) {
            console.error(err);
            process.kill(1);
        } else {
            process.kill(0);
        }
    });

});
