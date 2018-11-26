var mysql = require('mysql');
var $conf = require('../conf/conf');
var $sql = require('./courseAuthSQLMapping');

var pool = mysql.createPool( $conf.mysql );
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

function result_check(result, list, input_str) {
  //console.log('result-> ', result);
  if (!result) {
    if (result.affectedRows <= 0) list.push(input_str);
  }
};

module.exports = {
  get_courselist: function(req, res, next) {
    //console.log('req id->',req['user'][0].id);
    pool.getConnection(function(err, connection) {
      connection.query("select id, name, stu_id from courselist left join (select * from course_info where stu_id=?) as tmp on course_id=id",
          req['user'][0].id, function(err, result) {

            // 1-> yes, null-> no
            for (var val in result) {
              if (result[val]['stu_id']) {
                result[val]['stu_id'] = 'Yes';
              } else {
                result[val]['stu_id'] = 'No';
              }
            }

            if (err) res.render('fail');
            res.render('course_enrollment', {
              title:'courselist',
              result: result
            });
            connection.release();
          });

    });
  },

  updateProfile: function(req, res, next) {
    pool.getConnection(function(err, connection){
      var param = req.query || req.params;

      // set status waiting
      connection.query("UPDATE users SET id=?, username=?, status='waiting' WHERE id=?", 
          [param.id, param.username, param.rawid], function(err, result) {
        if (result.affectedRows > 0) {
          result = {
            code: 200,
            msg: "waiting confirm"
          };
        } else {
          result = void 0;
        }
        jsonOupt(res, result);
        connection.release();
      });
    })
  },

  enroll_commit: function(req, res, next) {
    var param = req.query || req.params;

    var user_id = req['user'][0].id,
    course_id = param.course_id;

    if (param.user_id) {
      user_id = param.user_id;
    }

    var failedlist = [];

    pool.getConnection(function(err, connection) {
      connection.query($sql.insert2course_info, [user_id, course_id], 
          function(err, result){
            result_check(result, failedlist, 'course_info');
          }); 

      connection.query($sql.insert2attend, [user_id, course_id], 
          function(err, result) {
            result_check(result, failedlist, 'attend');
          });

      connection.query($sql.insert2homework, [user_id, course_id],
          function(err, result){
            result_check(result, failedlist, 'homework');
          });

      connection.query($sql.insert2labs, [user_id, course_id],
          function(err, result){
            result_check(result, failedlist, 'labs');
          });

      connection.query($sql.insert2score_trace, [user_id, course_id],
          function(err, result){
            result_check(result, failedlist, 'score_trace');
          });

      connection.query($sql.insert2final, [user_id, course_id],
          function(err, result){
            result_check(result, failedlist, 'final');
          });


      if (failedlist.length === 0) {
          result = {
            'code': 200,
            'msg': 'success'
          };      
      } else {
        result = void 0;
        //TODO: failed bailout
      }

      jsonOupt(res, result);
      connection.release();
    });
  },

  quit_commit: function(req, res, next) {
    var param = req.query || req.params;
    var user_id = req['user'][0].id,
    course_id = param.course_id;

    var failedlist = [];

    if (param.user_id) {
      user_id = param.user_id;
    }

    pool.getConnection(function(err, connection) {
      connection.query($sql.quit2course_info, [user_id, course_id], 
          function(err, result){
            result_check(result, failedlist, 'course_info');
          }); 

      connection.query($sql.quit2attend, [user_id, course_id], 
          function(err, result) {
            result_check(result, failedlist, 'attend');
          });

      connection.query($sql.quit2homework, [user_id, course_id],
          function(err, result){
            result_check(result, failedlist, 'homework');
          });

      connection.query($sql.quit2labs, [user_id, course_id],
          function(err, result){
            result_check(result, failedlist, 'labs');
          });

      connection.query($sql.quit2score_trace, [user_id, course_id],
          function(err, result){
            result_check(result, failedlist, 'score_trace');
          });

      connection.query($sql.quit2final, [user_id, course_id],
          function(err, result){
            result_check(result, failedlist, 'final');
          });



      if (failedlist.length === 0) {
          result = {
            code: 200,
            msg: 'success'
          };      
      } else {
        result = void 0;
        //TODO: failed bailout
      }

      jsonOupt(res, result);
      connection.release();
    });
  },

  getAllGrade: function(req, res, next){
    var user_id = req['user'][0].id;

    pool.getConnection(function(err, connection) {
      connection.query($sql.get_grade, user_id, function(err, result) {

        res.render('course_grade', {
          title: 'getallgrade',
          result: result
        });

        connection.release();
      });
    })
  },

  getAttendScore: function(req, res, next) {
    var user_id = req['user'][0].id;
 
    pool.getConnection(function(err, connection) {
      connection.query($sql.get_attend, user_id, function(err, result) {

        var tmp = result;
        for (var rows = 0, len = tmp.length; rows < len; rows++) {
          each_row = tmp[rows];
          for (var val in each_row) {
            if (val != 'course_id' && val != 'name'){
              var air = each_row[val];
              if(!air || air === 0) {
                tmp[rows][val] = '-';
              } else if(air > 0) {
                tmp[rows][val] = 'x';
              } else {
                tmp[rows][val] = '✓';
              }
            }
          }
        }

        res.render('stu_course_attend', {
          title: 'getallattend',
          result: result
        });

        connection.release();
      });
    }) 
  },

  getHomeworkScore: function(req, res, next) {
   var user_id = req['user'][0].id;
 
    pool.getConnection(function(err, connection) {
      connection.query($sql.get_homework, user_id, function(err, result) {

        res.render('stu_course_homework', {
          title: 'getallhomework',
          result: result
        });

        connection.release();
      });
    }) 
  },

  getLabs: function(req, res, next) {
   var user_id = req['user'][0].id;
 
    pool.getConnection(function(err, connection) {
      connection.query($sql.get_labs, user_id, function(err, result) {

        res.render('stu_course_labs', {
          title: 'getalllabs',
          result: result
        });

        connection.release();
      });
    }) 
  },

  getFinal: function(req, res, next) {
    var user_id = req['user'][0].id;
 
    pool.getConnection(function(err, connection) {
      connection.query($sql.get_final, user_id, function(err, result) {

        res.render('stu_course_final', {
          title: 'getallfinal',
          result: result
        });
        connection.release();
      });
    }) 
  },

};
