var math = require('../math');

exports.index = function(req, res) {
  if (req.query.fibonum) {
    /*res.render('fibonacci', {
      title: "Calculate Fibonacci numbers",
      fibonum: req.query.fibonum,
      fiboval: math.fibonacci(req.query.fibonum)
    });*/
    math.fibonacciAsync(req.query.fibonum, function(err, fiboval) {
      res.render('fibonacci', {
        title: "Calculate Fibonacci numbers",
        fibonum: req.query.fibonum,
        fiboval: fiboval
      });
    });
    /*var httpreq = require('http').request({
      host: "localhost",
      port: 3002,
      path: "/fibonacci/"+Math.floor(req.query.fibonum),
      method: 'GET'
    }, function(httpresp) {
      httpresp.on('data', function (chunk) {
        var data = JSON.parse(chunk);
        res.render('fibonacci', {
          title: "Calculate Fibonacci numbers",
          fibonum: req.query.fibonum,
          fiboval: data.result
        });
      });
    });
    httpreq.end();*/
  } else {
    res.render('fibonacci', {
      title: "Calculate Fibonacci numbers",
      fiboval: undefined
    });
  }
};