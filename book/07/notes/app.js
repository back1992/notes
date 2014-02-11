
var flash = require('connect-flash')
  , express = require('express')
  , routes = require('./routes')
  , notes = require('./routes/notes')
  , users = require('./routes/users')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(users.serialize);
passport.deserializeUser(users.deserialize);
passport.use(users.strategy);

var app = module.exports = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'keyboard cat' }));
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

var seqConnectParams = {};

if (process.env.VCAP_SERVICES) {
  var VCAP = JSON.parse(process.env.VCAP_SERVICES);
  for (var svctype in VCAP) {
    if (svctype.match(/^mysql/)) {
      VCAP[svctype].forEach(function(svc) {
        if (svc.name === "notes-nwb") {
          seqConnectParams.dbname = svc.credentials.name;
          seqConnectParams.username = svc.credentials.username;
          seqConnectParams.password = svc.credentials.password;
          seqConnectParams.params = {
            host: svc.credentials.host,
            dialect: 'mysql'
          };
        }
      });
    }
  }
} else {
  // seqConnectParams = "./chap06.sqlite3";
  // seqConnectParams = "mongodb://localhost/chap06";
  seqConnectParams = require('./sequelize-params');
}

// var notesModel = require('./models-fs/notes');
// notesModel.connect("./Notes", function(err) {
//   if (err) throw err;
// });
// var notesModel = require('./models-sqlite3/notes');
// notesModel.connect("./chap06.sqlite3", function(err) {
//   if (err) throw err;
// });
var notesModel = require('./models-sequelize/notes');
notesModel.connect(seqConnectParams,
  function(err) {
    if (err) throw err;
  });
// var notesModel = require('./models-mongoose/notes');
// notesModel.connect("mongodb://localhost/chap06", function(err) {
//   if (err) throw err;
// });
[ routes, notes ].forEach(function(router) {
  router.configure({ model: notesModel });
});
// var usersModel = require('./models-memory/users');
var usersModel = require('./models-sequelize/users');
usersModel.connect(seqConnectParams,
  function(err) {
    if (err) throw err;
  });
users.configure({
  users: usersModel,
  passport: passport
});

app.get('/', routes.index);
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

// Comment this out to run with workforce or on appfog
http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});

// Use this line for appfog
//app.listen(process.env.VCAP_APP_PORT || 3000);
