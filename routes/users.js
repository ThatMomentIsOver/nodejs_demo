// login

var express = require('express');
var passport = require('passport');
var config = require('../conf/conf');
var mysql = require('mysql');
var LocalStrategy = require('passport-local').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;

var check = require('./admin');
//var users = require('../dao/users'); // import custom passport call (connect sql)
var foo = require('../dao/stupanel'); // import profile function

var router = express.Router();
var $conf = require('../conf/conf');

var connection = mysql.createConnection($conf.mysql);
var pool = mysql.createPool($conf.mysql);

connection.query('USE user');

var jsonOupt = function (res, ret) {
	if(typeof ret === 'undefined') {
		res.json({
			code:'1',
			msg: 'json write error'
		});
	} else {
		res.json(ret);
	}
};

passport.serializeUser(function(user, done) {
  console.log('serializer User id: ', user.id);
  if (user.id.length > 10) { user.id = (user.id).substr(0, 10); }
  done(null, user.id);
});

passport.deserializeUser(function(user, done) {
    console.log('deserializeUser: ', user);
		pool.getConnection(function(err, connection) {
			connection.query('select * from users where id = '+ user, 
          function(err, result) {
            //console.log('sql result:', result);
            done(err, result);
            connection.release();
          })
    })
});

passport.use(new GoogleStrategy({
  clientID: $conf.google.clientID,
  clientSecret: $conf.google.clientSecret,
  callbackURL: $conf.google.callbackURL,
  proxy: true,
  },
  function(request, accessToken, refreshToken, profile, done) {
     pool.getConnection(function(err, connection) {
      var id = (profile.id).substr(0, 10);
      connection.query('SELECT * FROM users where google_id=' + id,
          function(err, result) {
            if (err) return done(null, false); 
            if (Object.keys(result).length === 0) { 
              connection.query('INSERT users (id, google_id, permission, status) VALUE(?, ?, "guest", "waiting")', 
                  [id, id], function(err, result) {
                    if (err) return err;
                    return done(null, profile);
                  })
            } else {
              return done(null, result[0]);
            }
            connection.release();
          });
    });
  }));

passport.use(new GitHubStrategy({
  clientID: $conf.github.clientID,
  clientSecret: $conf.github.clientSecret,
  callbackURL: $conf.github.callbackURL,
  proxy: true,
  },
  function(accessToken, refreshToken, profile, done) {
 
    pool.getConnection(function(err, connection) {
      connection.query('SELECT * FROM users where github_id=' + profile.id,
          function(err, result) {
            if (err) return done(null, false); 
            if (Object.keys(result).length === 0) { 
              connection.query('INSERT users (id, github_id, permission, status) VALUE(?, ?, "guest", "waiting")', 
                  [profile.id, profile.id], function(err, result) {
                    if (err) return err;
                    //console.log(result);
                    return done(null, profile);
                  })
            } else {
              return done(null, result[0]);
            }
            connection.release();
          });
    });
}));

passport.use(new LocalStrategy({
  passReqToCallback: true
    }, function(req, username, password, done) {
      /*
      console.log('get username field: ', username);
      console.log('get password field: ', password);
      console.log(req.body);
      */
      if (!username || !password) return done(null, false);

      username = +username;
      if (isNaN(username)) {
        console.log('username is NaN');
        done(null, false);
      }
      connection.query('SELECT * FROM users where id = ' + username,
          function(err, result) {
            if (err)  return done(err); 
            if (!result) return done(null, false);
            if (Object.keys(result).length === 0) {
              return done(null, false);
            } 
            if (result[0]['password'] === password) {
              //console.log(result[0]);
              return done(null, result[0]);
            } else {
              //console.log('password error');
              //console.log(result[0]['id']);
              return done(null, false);
            }
          });
    }
));

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  res.render('login', {title:'Login'});
});

router.get('/login/github', passport.authenticate('github', { 
  scope: [ 'user:email' ] 
}));

router.get('/login/github/callback', passport.authenticate("github", {
  session: true,
  failureRedirect: '/users/login/failed',
  successRedirect: '/',
  failureFlash: true
}), function (req, res) {
  res.redirect('/admin');
});

router.get('/login/google',
  passport.authenticate('google', { scope: [
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read'
  ] }
));

router.get('/login/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });


router.post('/login', passport.authenticate('local', {
  session: true,
  failureRedirect: '/users/login/failed',
  successRedirect: '/',
  failureFlash: true
}),  function(req, res){
  res.redirect('./admin');
});

router.get('/login/failed', function(req, res, next) {
  res.render('login_failed', {title:'Login Failed'});
});

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'logout!');
  res.redirect('./login');
});

router.get('/logout_nolayout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/denied', function(req, res, next) {
  res.render('denied', {'title': 'denied'});
});

router.get('/profile', ensureAuthenticated, function(req, res, next) {
  res.render('profile', {'title': 'Profile'});  
});

router.post('/profile', ensureAuthenticated, function(req, res, next) {
  foo.updateProfile(req, res, next);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
}
module.exports = router;
