var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// mongodb connect
var mongoose = require('mongoose');
var dbUrl = '127.0.0.1:27017/movie';
var db = mongoose.connect(dbUrl);
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// Routers
// var routes = require('./routes/index');
// var users = require('./routes/users');
var movie = require('./routes/movie');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'movie'
    // store: new MongoStore({
    //      url: dbUrl,
    //      collection: 'sessions'
    // })
}))
app.use(require('connect-multiparty')());
app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment')
app.use(function(req, res, next) {
    var _user = req.session.user;
    app.locals.user = _user;
    next()
})

// app.use('/', routes);
app.use('/', movie);

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
  app.set('showStackError', true)
  app.locals.pretty = true
  mongoose.set('debug',true)
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
