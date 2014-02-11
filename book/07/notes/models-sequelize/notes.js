var util = require('util');
var Sequelize = require("sequelize");
var Note = undefined;

module.exports.connect = function(params, callback) {
    var sequlz = new Sequelize(params.dbname, params.username, params.password, params.params);
    Note = sequlz.define('Note', {
        notekey: { type: Sequelize.STRING, primaryKey: true, unique: true },
        title: Sequelize.STRING,
        body: Sequelize.TEXT
    });
    Note.sync().success(function() {
        callback();
    }).error(function(err) {
        callback(err);
    });
}

exports.disconnect = function(callback) {
    callback();
}

exports.create = function(key, title, body, callback) {
    Note.create({
        notekey: key,
        title: title,
        body: body
    }).success(function(note) {
        callback();
    }).error(function(err) {
        callback(err);
    });
}

exports.update = function(key, title, body, callback) {
    Note.find({ where: { notekey: key } }).success(function(note) {
        if (!note) {
            callback(new Error("No note found for key " + key));
        } else {
            note.updateAttributes({
                title: title,
                body: body
            }).success(function() {
                callback();
            }).error(function(err) {
                callback(err);
            });
        }
    }).error(function(err) {
        callback(err);
    });
}

exports.read = function(key, callback) {
    Note.find({ where: { notekey: key } }).success(function(note) {
        if (!note) {
            callback("Nothing found for " + key);
        } else {
            callback(null, {
                notekey: note.notekey, title: note.title, body: note.body
            });
        }
    });
}

exports.destroy = function(key, callback) {
    Note.find({ where: { notekey: key } }).success(function(note) {
        note.destroy().success(function() {
            callback();
        }).error(function(err) {
            callback(err);
        });
    });
}

exports.titles = function(callback) {
    Note.findAll().success(function(notes) {
        var thenotes = [];
        notes.forEach(function(note) {
            thenotes.push({ key: note.notekey, title: note.title });
        });
        callback(null, thenotes);
    });
}
