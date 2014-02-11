var notes = require('../models/notes');

exports.index = function(req, res) {
  res.render('index', { title: 'Notes', notes: notes });
};