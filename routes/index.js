var notes = undefined;

/*var request = require('request');
request('http://www.baidu.com', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var content = body // Print the google web page.
  }
})
*/
exports.configure = function(params) {
  notes = params.model;
}

exports.index = function(req, res){
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
exports.quiz = function(req, res){
  notes.titles(function(err, titles) {
    if (err) {
      res.render('showerror', {
        title: "Could not retrieve note keys from data store",
        user: req.user ? req.user : undefined,
        error: err
      });
    } else {
      res.render('quiz', {
        title: 'Quizs',
        user: req.user ? req.user : undefined,
        notes: titles
      });
    }
  });
};
exports.fetchweb = function(req, res){
  notes.titles(function(err, titles) {
    if (err) {
      res.render('showerror', {
        title: "Could not retrieve note keys from data store",
        user: req.user ? req.user : undefined,
        error: err
      });
    } else {
      res.render('quiz', {
        title: 'Quizs',
        user: req.user ? req.user : undefined,
        notes: titles
      });
    }
  });
};
