var notes = undefined;

exports.configure = function(params) {
    notes = params.model;
}

exports.index = function(req, res) {
  notes.titles(function(err, titles) {
    if (err) {
      res.render('showerror', {
        title: "Could not retrieve note keys from data store",
        user: req.user ? req.user : undefined,
        error: err
      });
    } else {
      res.render('index', {
        title: 'Notes',
        user: req.user ? req.user : undefined,
        notes: titles
      });
    }
  });
};