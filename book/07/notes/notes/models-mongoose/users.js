var util     = require('util');
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var dburl = undefined;
exports.connect = function(thedburl, callback) {
    dburl = thedburl;
    mongoose.connect(dburl);
}

exports.disconnect = function(callback) {
    mongoose.disconnect(callback);
}

var UserSchema = new Schema({
    id: Integer,
    username: String,
    password: String,
    email   : String
});

mongoose.model('User', UserSchema);
var User = mongoose.model('User');

module.exports.findById = function(id, callback) {
    User.findOne({ id: id }, function(err, doc) {
        if (err) callback(err);
        else     callback(null, {
            id: user.id, username: user.username, password: user.password, email: user.email
        });
    });
}

module.exports.findByUsername = function(username, callback) {
    User.findOne({ username: username }, function(err, doc) {
        if (err) callback(err);
        else     callback(null, {
            id: user.id, username: user.username, password: user.password, email: user.email
        });
    });
}

module.exports.create = function(id, username, password, email, callback) {
    var newUser      = new User();
    newUser.id       = id;
    newUser.username = username;
    newUser.password = password;
    newUser.email    = email;
    newUser.save(function(err) {
        if (err) callback(err);
        else     callback();
    });
}

module.exports.update = function(id, username, password, email, callback) {
    exports.findById(id, function(err, doc) {
        if (err) callback(err);
        else {
            doc.username = username;
            doc.password = password;
            doc.email    = email;
            doc.save(function(err) {
                if (err) callback(err);
                else     callback();
            });
        }
    });
}