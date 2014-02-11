var express = require('express')
  , flash = require('connect-flash')
  , notes = require('./routes/notes')
  , routes = require('./routes/index')
  , users = require('./routes/users')
  , url  = require('url')
  , http = require('http')
  , path = require('path')
  // , socketio = require('socket.io')
  , util = require('util')
  , MySQLSessionStore = require('connect-mysql-session')(express)
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


var seqConnectParams = require('./sequelize-params');

var sessionStore = new MySQLSessionStore(seqConnectParams.dbname, seqConnectParams.username, seqConnectParams.password, seqConnectParams.params);

passport.serializeUser(users.serialize);
passport.deserializeUser(users.deserialize);
passport.use(users.strategy);

var notesModel = require('./models-sequelize/notes');
notesModel.connect(seqConnectParams,
    function(err) { if (err) throw err; });
[ routes, notes ].forEach(function(router) {
  router.configure({ model: notesModel });
});
var usersModel = require('./models-sequelize/users');
usersModel.connect(seqConnectParams,
  function(err) {
    if (err) throw err;
  });
users.configure({
  users: usersModel,
  passport: passport
});

var app = express();

var sessionSecret = 'keyboard cat';
var sessionKey    = 'express.sid';

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: sessionSecret, key: sessionKey, store: sessionStore }));
// Initialize Passport! Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ("development" === app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);
app.get('/quiz', routes.quiz);
app.get('/fetchweb', routes.fetchweb);
app.get('/getcontent', notes.getcontent);
app.get('/noteview',   notes.view);
app.get('/noteadd',    users.ensureAuthenticated, notes.add);
app.get('/noteedit',   users.ensureAuthenticated, notes.edit);
app.get('/notedestroy', users.ensureAuthenticated, notes.destroy);
app.post('/notedodestroy',  users.ensureAuthenticated, notes.dodestroy);
app.post('/notesave',  users.ensureAuthenticated, notes.save);
app.get('/account',    users.ensureAuthenticated, users.doAccount);
app.get('/login',      users.doLogin);
app.post('/login',     passport.authenticate('local', {
    failureRedirect: '/login', failureFlash: true
  }), users.postLogin);
app.get('/logout',     users.doLogout);
app.get('/sendmessage', users.ensureAuthenticated, users.sendMessage);
app.post('/sendmessage', users.ensureAuthenticated, users.doSendMessage);

var server = http.Server(app);

// git://github.com/LearnBoost/socket.io.git
// "socket.io-client": "git://github.com/LearnBoost/socket.io-client.git",
// var socketio = require('socket.io');
var io = require('socket.io').listen(server); // socket.io 0.9.x
// var io = require('socket.io')(server, {static: true}); // socket.io 1.0.x
// io.attach(server);

/*io.sockets.on('event', function(e) {
  util.log(util.inspect(e));
})*/

io.sockets.on('connection', function (socket) {
  socket.on('notetitles', function(fn) {
    notesModel.titles(function(err, titles) {
      if (err) {
        util.log(err);
        // send error message ??
      } else {
        fn(titles);
      }
    });
  });
  
  var broadcastUpdated = function(newnote) {
    socket.emit('noteupdated', newnote);
  }
  notesModel.emitter.on('noteupdated', broadcastUpdated);
  socket.on('disconnect', function() {
    notesModel.emitter.removeListener('noteupdated', broadcastUpdated);
  });
  
  var broadcastDeleted = function(notekey) {
    socket.emit('notedeleted', notekey);
  }
  notesModel.emitter.on('notedeleted', broadcastDeleted);
  socket.on('disconnect', function() {
    notesModel.emitter.removeListener('notedeleted', broadcastDeleted);
  });
  
  socket.on('getmessages', function(id, fn) {
    usersModel.getMessages(id, function(err, messages) {
      if (err) {
        util.log('getmessages ERROR ' + err);
        // send error??
      } else {
        util.log('sending messages ' + util.inspect(messages));
        fn(messages);
      }
    });
  });
  
  var broadcastNewMessage = function(id) {
    util.log('APP newmessage '+ id);
    socket.emit('newmessage', id);
  }
  usersModel.emitter.on('newmessage', broadcastNewMessage);
  var broadcastDelMessage = function() {
    util.log('APP delmessage ');
    socket.emit('delmessage');
  }
  usersModel.emitter.on('delmessage', broadcastDelMessage);
  
  socket.on('dodelmessage', function(id, from, message, fn) {
    util.log('dodelmessage '+ id +' '+ from +' '+ message);
    usersModel.delMessage(id, from, message, function(err) {
      
    });
  });
});


server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
