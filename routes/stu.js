var express = require('express');
var router = express.Router();

var foo = require('../dao/stupanel');

router.get('/', function(req, res, next) {
  res.send('test');
});

router.get('/enroll', ensureAuthenticated, checkStatus, 
    function(req, res, next) {
  foo.get_courselist(req, res, next);
});

router.get('/enroll_commit', ensureAuthenticated, checkStatus,
    function(req, res, next) {
  foo.enroll_commit(req, res, next);
});

router.get('/quit_commit', ensureAuthenticated, checkStatus,
    function(req, res, next) {
  foo.quit_commit(req, res, next);
});

router.get('/getgrade', ensureAuthenticated, checkStatus,
    function(req, res, next) {
  foo.getAllGrade(req, res, next);
});

router.get('/getattend', ensureAuthenticated, checkStatus,
    function(req, res, next) {
  foo.getAttendScore(req, res, next);
});

router.get('/gethomework', ensureAuthenticated, checkStatus,
    function(req, res, next) {
  foo.getHomeworkScore(req, res, next);
});

router.get('/getlabs', ensureAuthenticated, checkStatus,
    function(req, res, next) {
  foo.getLabs(req, res, next);
});

router.get('/getfinal', ensureAuthenticated, checkStatus, 
    function(req, res, next) {
      foo.getFinal(req, res, next);
    });

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
}

function checkStatus(req, res, next) {
  var user_status = req.user[0]['status'];
  if (user_status != 'waiting') {
    return next();
  }
  res.redirect('/users/profile');
}

module.exports = router;
