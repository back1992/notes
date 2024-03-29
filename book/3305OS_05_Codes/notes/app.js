
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , notes = require('./routes/notes')
  , http = require('http')
  , path = require('path');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/noteview',   notes.view);
app.get('/noteadd',    notes.add);
app.get('/noteedit',   notes.edit);
app.get('/notedestroy', notes.destroy);
app.post('/notedodestroy',  notes.dodestroy);
app.post('/notesave',  notes.save);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
