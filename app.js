var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    done=false,
    fs = require('fs');

// variable to set when transitioning between development or production
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

// uncomment after placing your favicon in /public
//angular.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'server')));

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
require('./public/javascripts/deleteFiles');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use('/', routes);
// angular.use('/form', form);
app.use('/upload', upload); // Get the document listing
app.use('/create', form); // POST the form to MongoDB
app.use('/document', upload); // POST the PDF to MongoDB


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
