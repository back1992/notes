var util      = require('util');
var Sequelize = require("sequelize");
var sequelize = undefined;
var User      = undefined;

module.exports.connect = function(params, callback) {
    sequelize = new Sequelize(params.dbname, params.username, params.password, params.params);
    User = sequelize.define('User', {
        id: { type: Sequelize.INTEGER, primaryKey: true, unique: true },
        username: { type: Sequelize.STRING, unique: true },
        password: Sequelize.STRING,
        email: Sequelize.STRING
    });
    User.sync().success(function() {
        callback();
    }).error(function(err) {
        callback(err);
    });
}

exports.disconnect = function(callback) {
    callback();
}

/*var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
  , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];*/

module.exports.findById = function(id, callback) {
    User.find({ where: { id: id } }).success(function(user) {
        if (!user) {
            callback('User ' + id + ' does not exist');
        } else {
            callback(null, {
                id: user.id, username: user.username, password: user.password, email: user.email
            });
        }
    });
}

module.exports.findByUsername = function(username, callback) {
    User.find({ where: { username: username } }).success(function(user) {
        if (!user) {
            callback('User ' + username + ' does not exist');
        } else {
            callback(null, {
                id: user.id, username: user.username, password: user.password, email: user.email
            });
        }
    });
}

module.exports.create = function(id, username, password, email, callback) {
    User.create({
        id: id,
        username: username,
        password: password,
        email: email
    }).success(function(user) {
        callback();
    }).error(function(err) {
        callback(err);
    });
}

module.exports.update = function(id, username, password, email, callback) {
    User.find({ where: { id: id } }).success(function(user) {
        user.updateAttributes({
            id: id,
            username: username,
            password: password,
            email: email
        }).success(function() {
            callback();
        }).error(function(err) {
            callback(err);
        });
    });
}
