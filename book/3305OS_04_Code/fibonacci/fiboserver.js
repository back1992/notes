var math  = require('./math');
var express = require('express');
var util = require('util');
var app = express();
app.configure(function(){
    app.use(app.router);
});
app.get('/fibonacci/:n', function(req, res, next) {
    /*math.fibonacciAsync(Math.floor(req.params.n), function(err, val) {
        if (err) next('FIBO SERVER ERROR ' + err);
        else {
            res.send({
                n: req.params.n,
                result: val
            });
        }
    });*/
    res.send({
        n: req.params.n,
        result: math.fibonacciLoop(Math.floor(req.params.n))
    });
});
app.listen(3002);