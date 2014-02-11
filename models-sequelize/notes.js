var util = require('util');
var Sequelize = require("sequelize");
var Note = undefined;

var events = require('events');
var emitter = module.exports.emitter = new events.EventEmitter();

module.exports.connect = function(params, callback) {
    var sequlz = new Sequelize(params.dbname, params.username, params.password, params.params);
    Note = sequlz.define('Note', {
        notekey: { type: Sequelize.STRING, primaryKey: true, unique: true },
        title: Sequelize.STRING,
        begin: Sequelize.STRING,
        end: Sequelize.STRING,
        pattern: Sequelize.STRING,
        body: Sequelize.TEXT,
        url: Sequelize.TEXT
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

exports.create = function(key, title, body, begin, end, pattern, callback) {
    Note.create({
        notekey: key,
        title: title,
        body: body,
        url: title,
        begin: begin,
        end: end,
        pattern: pattern
    }).success(function(note) {
        exports.emitter.emit('noteupdated', {
            key: key, title: title, body: body
        });
        callback();
    }).error(function(err) {
        callback(err);
    });
}

exports.update = function(key, title, body, begin, end, pattern ,callback) {
    Note.find({ where: { notekey: key } }).success(function(note) {
        if (!note) {
            callback(new Error("No note found for key " + key));
        } else {
            note.updateAttributes({
                title: title,
                body: body,
                begin: begin,
                end: end,
                pattern: pattern
            }).success(function() {
                exports.emitter.emit('noteupdated', {
                    key: key, title: title, body: body, begin: begin, end: end, pattern: pattern
                });
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
                // BUGGY notekey: note.notekey, title: "THIS IS A BUG " + note.title, body: note.body
                notekey: note.notekey, title: note.title, body: note.body, begin: note.begin, end: note.end, pattern: note.pattern
            });
        }
    });
}

exports.destroy = function(key, callback) {
    Note.find({ where: { notekey: key } }).success(function(note) {
        if (note)
            note.destroy().success(function() {
                emitter.emit('notedeleted', key);
                callback();
            }).error(function(err) {
                callback(err);
            });
            else callback();
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



