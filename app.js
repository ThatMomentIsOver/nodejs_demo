var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');    		
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GithubStrategy = require('passport-github').Strategy;
var multer = require('multer');
var flash = require('connect-flash');

var index = require('./routes/index');
var admin = require('./routes/admin');
var stu = require('./routes/stu');
var user = require('./routes/users');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');  

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));   	// load js file
// app.use(express.static(path.join(__dirname, 'bower_components')));

app.use(session({
    secret: 'ss3cr3t',
    resave: true,
    cookie: { maxAge: 1000000 },
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});


app.use('/', index);
app.use('/admin', admin);
app.use('/users', user);
app.use('/auth', stu);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
