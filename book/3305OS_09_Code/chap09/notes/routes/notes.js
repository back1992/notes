var util = require('util');

var notes = undefined;
exports.configure = function(params) {
    notes = params.model;
}

var readNote = function(key, user, res, cb) {
    notes.read(key,
        function(err, data) {
            if (err) {
                res.render('showerror', {
                    title: "Could not read note " + key,
                    user: user ? user : undefined,
                    error: err
                });
                cb(err);
            }
            /* FIXED else if (!data) cb(new Error("No note found for " + key)); */
            else cb(null, data);
        });
}

exports.view = function(req, res, next) {
    var user = req.user ? req.user : undefined;
    if (/* FIXED req.query && */ req.query.key) {
        readNote(req.query.key, user, res, function(err, data) {
            if (!err) {
                res.render('noteview', {
                    title: data.title,
                    user: user,
                    notekey: req.query.key,
                    note: data
                });
            } /* FIXED  else {
                res.render('showerror', {
                    title: 'No note found for ' + req.query.key,
                    user: user,
                    error: "Invalid key " + req.query.key
                });
            } */
        });
    } else {
        res.render('showerror', {
            title: "No key given for Note",
            user: user,
            error: "Must provide a Key to view a Note"
        });
    }
}

exports.save = function(req, res, next) {
    // util.log('save ' + util.inspect(req));
    ((req.body.docreate === "create")
        ? notes.create : notes.update
    )(req.body.notekey, req.body.title, req.body.body,
        function(err) {
            if (err) {
                // show error page
                // util.log('save '+ util.inspect(err));
                res.render('showerror', {
                    user: req.user ? req.user : undefined,
                    title: "Could not update file",
                    error: err
                });
            } else {
                // util.log('save redirect '+ req.body.notekey);
                res.redirect('/noteview?key='+req.body.notekey);
            }
        });
}

exports.add = function(req, res, next) {
    res.render('noteedit', {
        title: "Add a Note",
        user: req.user ? req.user : undefined,
        docreate: true,
        notekey: "",
        note: undefined
    });
}

exports.edit = function(req, res, next) {
    var user = req.user ? req.user : undefined;
    if (/* FIXED req.query && */ req.query.key) {
        readNote(req.query.key, user, res, function(err, data) {
            if (!err) {
                res.render('noteedit', {
                    title: data ? ("Edit " + data.title) : "Add a Note",
                    user: user,
                    docreate: false,
                    notekey: req.query.key,
                    note: data
                });
            } /* FIXED else {
                res.render('showerror', {
                    title: 'No note found for ' + req.query.key,
                    user: user,
                    error: "Invalid key " + req.query.key
                });
            } */
        });
    } else {
        res.render('showerror', {
            title: "No key given for Note",
            user: user,
            error: "Must provide a Key to view a Note"
        });
    }
}

exports.destroy = function(req, res, next) {
    var user = req.user ? req.user : undefined;
    if (/* FIXED req.query && */ req.query.key) {
        readNote(req.query.key, user, res, function(err, data) {
            if (!err) {
                res.render('notedelete', {
                    title: data.title,
                    user: user,
                    notekey: req.query.key,
                    note: data
                });
            } /* FIXED else {
                res.render('showerror', {
                    title: 'No note found for ' + req.query.key,
                    user: user,
                    error: "Invalid key " + req.query.key
                });
            } */
        });
    } else {
        res.render('showerror', {
            title: "No key given for Note",
            user: user,
            error: "Must provide a Key to view a Note"
        });
    }
}

exports.dodestroy = function(req, res, next) {
    notes.destroy(req.body.notekey, function(err) {
        if (err) {
            res.render('showerror', {
                title: "Could not delete Note " + req.body.notekey,
                user: req.user ? req.user : undefined,
                error: err
            });
        } else {
            res.redirect('/');
        }
    });
}