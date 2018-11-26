var express = require('express');
var router = express.Router();
var attendFoo = require('../dao/attend');
var manageFoo = require('../dao/adminpanel');
var stuFoo = require('../dao/stupanel'); // reuse for quit course

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/courselist', ensureAuthenticated, ensureRootPermission, 
    function(req, res, next) {
      manageFoo.get_courselist(req, res, next);
    });

router.get('/attendList', ensureAuthenticated, ensureRootPermission,
    function(req, res, next) {
      manageFoo.get_attend(req, res, next);
    });

router.get('/queryAttend', 
    function(req, res, next) {
      manageFoo.queryAttendById(req, res, next);
    });

router.post('/updateAttend', ensureAuthenticated, ensureRootPermission,
    function(req, res, next) {
      manageFoo.updateAttend(req, res, next);
    });

router.get('/appendCourse', ensureAuthenticated, ensureRootPermission, 
    function(req, res, next) {
      manageFoo.addCourse(req, res, next); 
    });

router.get('/appendCourseMiddle', ensureAuthenticated, ensureRootPermission,
    function(req, res, next) {
      res.render('addCourse', {
        title: 'addCourse'
      });
    });

router.get('/deleteCourse', ensureAuthenticated, ensureRootPermission, 
    function(req, res, next) {
      manageFoo.delCourse(req, res, next);
    });

router.get('/courseInfo', ensureAuthenticated, ensureRootPermission, 
    function(req, res, next) {
      manageFoo.getCourseInfo(req, res, next);
    });

router.get('/enrollList', ensureAuthenticated, ensureRootPermission, 
    function(req, res, next) {
      manageFoo.getEnrollList(req, res, next);
    });

router.get('/quit_enroll', ensureAuthenticated, ensureRootPermission,
    function(req, res, next) {
      stuFoo.quit_commit(req, res, next);
    });

router.get('/addEnroll', ensureAuthenticated, ensureRootPermission, 
    function(req, res, next) {
      res.render('admin_addenroll', {
        title: 'addenroll'
      });
    });

router.post('/addEnroll', ensureAuthenticated, ensureRootPermission, 
    function(req, res, next) {
      manageFoo.enroll_commit(req, res, next);
    });

router.get('/queryEnroll', 
    function(req, res, next) {
      manageFoo.queryEnrollById(req, res, next);
    });


router.get('/homeworkList', ensureAuthenticated, ensureRootPermission,
    function(req, res, next) {
      manageFoo.getHomeworkList(req, res, next);
    });

router.get('/updateHomework',ensureAuthenticated, ensureRootPermission,
    function(req, res, next) {
      manageFoo.updatehomework(req, res, next);
    });

router.get('/queryhomework',
    function(req, res, next) {
      manageFoo.queryHomeworkById(req, res, next);
    });


router.get('/labsList', ensureAuthenticated, ensureRootPermission,
    function(req, res, next) {
      manageFoo.getLabsList(req, res, next);
    });

router.get('/updateLabs',ensureAuthenticated, ensureRootPermission,
    function(req, res, next) {
      manageFoo.updateLabs(req, res, next);
    });

router.get('/querylabs', 
    function(req, res, next) {
      manageFoo.queryLabsById(req, res, next);
    });

router.get('/infoList', ensureAuthenticated, ensureRootPermission,
    function(req, res, next) {
      manageFoo.getInfoList(req, res, next);
    });

router.get('/queryInfo',
    function(req, res, next) {
      manageFoo.queryInfo(req, res, next);
    });

router.get('/infoReload',ensureAuthenticated, ensureRootPermission,
    function(req, res, next) {
      manageFoo.reloadInfoList(req, res, next);
    });

router.get('/finalList', ensureAuthenticated, ensureRootPermission,
    function(req, res, next) {
      manageFoo.getFinalList(req, res, next);
    });


router.get('/updateFinal',ensureAuthenticated, ensureRootPermission,
    function(req, res, next) {
      manageFoo.updatefinal(req, res, next);
    });

router.get('/updateAllFinalMiddle',ensureAuthenticated, ensureRootPermission,
    function(req, res, next) {
      manageFoo.updateAllfinalPage(req, res, next);
    });

router.post('/updateAllFinal',ensureAuthenticated, ensureRootPermission,
    function(req, res, next) {
      manageFoo.updateAllfinal(req, res, next);
    });

router.get('/queryFinal',
    function(req, res, next) {
      manageFoo.queryFinalById(req, res, next);
    });


router.get('/traceList', ensureAuthenticated, ensureRootPermission,
    function(req, res, next) {
      manageFoo.getTraceList(req, res, next);
    });


router.get('/queryTrace', 
    function(req, res, next) {
      manageFoo.queryTraceById(req, res, next);
    });

router.get('/setAttendOpMiddle', ensureAuthenticated, ensureRootPermission,
    function(req, res, next) {
      res.render('admin_setAttendOpMiddle', {
        title: 'admin_setAttendOpMiddle'      
      });
    });

router.get('/setAttendOp', ensureAuthenticated, ensureRootPermission,
    function(req, res, next) {
      manageFoo.updateAttendScore(req, res, next);
    });

router.get('/setPerMiddle',ensureAuthenticated, ensureRootPermission,
    function(req, res, next) {
      res.render('admin_setPerMiddle', {
        title: 'courselist'
      })
    });

router.get('/setPer', ensureAuthenticated, ensureRootPermission,
    function(req, res, next) {
      manageFoo.setPer(req, res, next);
    });

router.get('/confirmUser',ensureAuthenticated, ensureRootPermission,
    function(req, res, next) {
      manageFoo.getWaitingConfirmUser(req, res, next);
    });

router.post('/confirmUser',ensureAuthenticated, ensureRootPermission,
    function(req, res, next) {
      manageFoo.confirmUser(req, res, next);
    });


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
}

function ensureRootPermission(req, res, next) {
  if ( 0 === Object.keys(req.user).length ) {
    res.redirect('/users/denied');
  }
  if ( 'root' == req.user[0].permission ) {
    return next();
  }
  res.redirect('/users/denied');
}

module.exports = router;
