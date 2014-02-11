
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
            } else cb(null, data);
        });
}

exports.view = function(req, res, next) {
    if (req.query.key) {
        var user = req.user ? req.user : undefined;
        readNote(req.query.key, user, res, function(err, data) {
            if (!err) {
                res.render('noteview', {
                    title: data.title,
                    user: user,
                    notekey: req.query.key,
                    note: data
                });
            }
        });
    } else {
        res.render('showerror', {
            title: "No key given for Note",
            user: req.user ? req.user : undefined,
            error: "Must provide a Key to view a Note"
        });
    }
}

exports.save = function(req, res, next) {
    ((req.body.docreate === "create")
        ? notes.create : notes.update
    )(req.body.notekey, req.body.title, req.body.body,
        function(err) {
            if (err) {
                // show error page
                res.render('showerror', {
                    user: req.user ? req.user : undefined,
                    title: "Could not update file",
                    error: err
                });
            } else {
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
    if (req.query.key) {
        var user = req.user ? req.user : undefined;
        readNote(req.query.key, user, res, function(err, data) {
            if (!err) {
                res.render('noteedit', {
                    title: data ? ("Edit " + data.title) : "Add a Note",
                    user: user,
                    docreate: false,
                    notekey: req.query.key,
                    note: data
                });
            }
        });
    } else {
        res.render('showerror', {
            title: "No key given for Note",
            user: req.user ? req.user : undefined,
            error: "Must provide a Key to view a Note"
        });
    }
}

exports.destroy = function(req, res, next) {
    if (req.query.key) {
        var user = req.user ? req.user : undefined;
        readNote(req.query.key, user, res, function(err, data) {
            if (!err) {
                res.render('notedelete', {
                    title: data.title,
                    user: user,
                    notekey: req.query.key,
                    note: data
                });
            }
        });
    } else {
        res.render('showerror', {
            title: "No key given for Note",
            user: req.user ? req.user : undefined,
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