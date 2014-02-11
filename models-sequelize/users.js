var util      = require('util');
var Sequelize = require("sequelize");
var async     = require('async');
var sequelize = undefined;
var User      = undefined;
var Messages  = undefined;

var events = require('events');
var emitter = module.exports.emitter = new events.EventEmitter();

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
    Messages = sequelize.define('Messages', {
        idTo: { type: Sequelize.INTEGER, unique: false },
        idFrom: { type: Sequelize.INTEGER, unique: false },
        message: { type: Sequelize.STRING, unique: false }
    });
    Messages.sync();
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

module.exports.allUsers = function(callback) {
    User.findAll().success(function(users) {
        if (users) {
            var theusers = [];
            users.forEach(function(user) {
                theusers.push({ id: user.id, name: user.username });
            });
            callback(null, theusers);
        } else callback();
    });
}

module.exports.sendMessage = function(id, from, message, callback) {
    Messages.create({
        idTo: id, idFrom: from, message: message
    }).success(function(user) {
        util.log('MODEL newmessage ' + id);
        emitter.emit('newmessage', id);
        callback();
    }).error(function(err) {
        callback(err);
    });
}

module.exports.getMessages = function(id, callback) {
    Messages.findAll({ where: { idTo: id } }).success(function(messages) {
        if (messages) {
            var themessages = [];
            async.eachSeries(messages,
                function(msg, done) {
                    module.exports.findById(msg.idFrom, function(err, userFrom) {
                        themessages.push({
                            idTo: msg.idTo,
                            idFrom: msg.idFrom,
                            fromName: userFrom.username,
                            message: msg.message
                        });
                        done();
                    });
                },
                function(err) {
                    if (err) callback(err);
                    else callback(null, themessages);
                });
        } else callback();
    })
}

module.exports.delMessage = function(id, from, message, callback) {
    util.log('MODEL delMessage '+ id +' '+ from +' '+ message);
    Messages.find({ where: { idTo: id, idFrom: from, message: message } }).success(function(msg) {
        if (msg) {
            msg.destroy().success(function() {
                util.log('delmessage');
                emitter.emit('delmessage');
                callback();
            }).error(function(err) {
                callback(err);
            });
        } else callback();
    })
}