var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    mongoose = require('mongoose');
    done=false,
    fs = require('fs'),
    passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    cookieParser = require('cookie-parser'),
    session = require('express-session');


// variable to set when transitioning between development or production
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

// uncomment after placing your favicon in /public
//angular.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize()); // Passport
app.use(passport.session()); // Passport
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'server')));
app.use(cookieParser()); // Passport
app.use(session({secret: 'Oakes'})); // Passport

/* Mongoose & MongoDB config */
var config = {
  db : 'mongodb://localhost:27017/pdf_viewer',
  rootPath : __dirname
};
require('./server/config/mongoose')(config);
require('./server/config/mongodb')(config);



/* Routes */
var form = require('./routes/form');
var routes = require('./routes/index');
var upload = require('./routes/upload');

/* File upload */
app.use(multer ({ dest: './server/uploads/',
  rename: function (fieldname, filename) {
    return filename;
  },
  onFileUploadStart: function(file) {
    console.log(file.originalname + ' is starting ...');
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to ' + file.path);
    done = true;
  }
}));

// Get '/server/uploads/' directory
// require('./public/javascripts/deleteFiles');
// require('./public/javascripts/readFiles');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use('/', routes);
app.use('/read', routes);
// angular.use('/form', form);
app.use('/upload', upload); // Get the document listing
app.use('/document', upload); // POST the PDF to MongoDB
app.use('/create', form); // POST the form to MongoDB

/* TODO  : Refactor passport code */
/* User authentication */
var User = mongoose.model('User');
passport.use(new localStrategy (
  function(username, password, done) {
      User.findOne({userName: username}).exec(function(err, user){
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
  }
));

passport.serializeUser(function (user, done){
  if (user) done(null, user._id);
});

passport.deserializeUser(function(id, done){
  User.findOne({_id: id}).exec(function(err, user){
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
});

/* Post to login */
app.post('/login', function (req, res, next){
  var auth = passport.authenticate('local', function(err, user){
    if (err) { return next(err); }
    if (!user) { res.send({ success: false});}
    req.logIn(user, function(err){
      if (err) {return next(err);}
      res.send({success: true, user: user});
    });
  });
  auth(req, res, next);
});

/* Get login partial */
app.get('/partials/:partialPath', function(req, res){
  res.render('partials/' + req.params.partialPath);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
