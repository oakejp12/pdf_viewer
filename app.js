var express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  multer = require('multer'),
  done = false;

// variable to set when transitioning between development or production
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));


app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'server')));

/* Mongoose & MongoDB config */
var config = {
  db: 'mongodb://localhost:27017/pdf_viewer',
  rootPath: __dirname
};
require('./server/config/mongodb')(config);



/* Routes */
var form = require('./routes/form');
var routes = require('./routes/index');
var upload = require('./routes/upload');

/* File upload */
app.use(multer({
  // TODO : Change based on version
  // ./server/uploads/{version}/
  dest: './server/uploads/7-10-1620/',
  rename: function (fieldname, filename) {
    return filename;
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...');
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to ' + file.path);
    done = true;
  }
}));

// Get '/server/uploads/' directory
// require('./public/javascripts/readFiles');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use('/', routes);
app.use('/read', routes);
// app.use('/form', form);
app.use('/upload', upload); // Get the document listing
app.use('/document', upload); // POST the PDF to MongoDB
app.use('/create', form); // POST the form to MongoDB

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/*
 **** Error handlers ****
 */

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;