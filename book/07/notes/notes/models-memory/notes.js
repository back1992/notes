
var notes = [];

exports.connect = exports.disconnect = function(callback) {
    callback();
}

exports.update = exports.create = function(key, title, body, callback) {
    notes[key] = { title: title, body: body };
    callback();
}

exports.read = function(key, callback) {
    callback(undefined, notes[key]);
}

exports.destroy = function(key, callback) {
    delete notes[key];
    callback();
}

exports.keys = function(callback) {
    callback(undefined, Object.keys(notes));
}
