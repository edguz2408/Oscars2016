var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var expressSession = require('express-session');
var flash = require('connect-flash');

//mongo related code
var mongo = require('mongodb');
var mongoose = require('mongoose');
var dbConfig = require('./db/db.js');
mongoose.connect(dbConfig.url);


var routes = require('./routes/index')(passport);
var users = require('./routes/users');

var app = express();

//passport
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//mongoimport --db oscars --collection Nominations --drop --file Nominees.json

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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

//app.listen(4000, '45.55.71.58');
module.exports = app;
