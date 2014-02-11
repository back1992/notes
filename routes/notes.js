var util = require('util');

var xpath = require('xpath')
, dom = require('xmldom').DOMParser;
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
var request = require('request');

exports.view = function(req, res, next) {
    var user = req.user ? req.user : undefined;
    if (/* FIXED req.query && */ req.query.key) {
        readNote(req.query.key, user, res, function(err, data) {
            if (!err) {
                console.log(data);
                res.render('noteview', {
                    title: data.title,
                    begin: data.begin,
                    end: data.end,
                    pattern: data.pattern,
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
        )(req.body.notekey, req.body.title, req.body.body, req.body.begin, req.body.end, req.body.pattern, 
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
    exports.getcontent = function(req, res, next) {
       var user = req.user ? req.user : undefined;
       if (/* FIXED req.query && */ req.query.key) {
        readNote(req.query.key, user, res, function(err, data) {
            if (!err) {

                // request('http://www.tingclass.net/list-5407-1.html', function (error, response, body) {
                    request(data.body, function (error, response, body) {
                        console.log(req.user);
                        console.log(data);
                        var posBegin = body.indexOf(data.begin);
                        var posEnd = body.lastIndexOf(data.end);
                        var content = body.slice(posBegin, posEnd);

                        // var pattern2 =  /href="(http[^\'\"]+)/g;

                        var pattern = new RegExp(data.pattern, "g");

                        var mres = content.match(pattern);
                        // var mres = content.match(pattern2);

                        console.log(typeof(mres));
                        console.log(mres[1]);
                        console.log(pattern);
                        // console.log(pattern2);
                        console.log(typeof(pattern));
                        // console.log(typeof(pattern2));


                      res.render('getcontent', {
                        title: 'get title',
                        user: user,
                        notekey: 'req.query.key',
                        notes: mres
                        // note: body
                    });
                  })
/*                res.render('noteview', {
                    // title: data.body,
                    title: data.title,
                    user: user,
                    notekey: req.query.key,
                    note: data
                });*/
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
