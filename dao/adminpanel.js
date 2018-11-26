var mysql = require('mysql');
var async = require('async');
var $conf = require('../conf/conf');
var $sql = require('./adminSQLMapping.js');
var stuFoo = require('./stupanel.js');

var sql_connection = mysql.createConnection($conf.mysql);
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

function gen_update_final_sql(field, stu_id, course_id) {
  return 'UPDATE final SET ' + field + ' WHERE stu_id=' + stu_id + ' AND course_id=' + course_id; 
}

module.exports = {

  get_courselist: function(req, res, next) {

    pool.getConnection(function(err, connection) {
      connection.query($sql.get_courselist, function(err, result) {
        res.render('admin_courselist', {
          title: 'courselist',
          result: result
        });
      connection.release();
      });
    });
  },

  delCourse: function(req, res, next) {
    var param = req.query || req.params;  
    var id = +param.course_id;

    pool.getConnection(function(err, connection) {
      connection.query($sql.del2courselist, id, 
          function(err, result){}); 
      connection.query($sql.del2course_info, id, 
          function(err, result){}); 
      connection.query($sql.del2attend, id, 
          function(err, result) {});
      connection.query($sql.del2homework, id,
          function(err, result){});
      connection.query($sql.del2labs, id,
          function(err, result){});
      connection.query($sql.del2score_trace, id,
          function(err, result){});
      connection.query($sql.del2final, id,
          function(err, result){});

      result = {
        code: 200,
        msg: 'success'
      };      

      connection.release();
      jsonOupt(res, result);
    });


  },


  addCourse: function(req, res, next) {
    var param = req.query || req.params;  
    pool.getConnection(function(err, connection) {

      connection.query($sql.add_course, [param.course_id, param.course_name], function(err, result) {
        if(result === undefined) {
          result = {
            code: 400,
            msg: 'error'
          };
        } else {
          result = {
            code: 200,
            msg:'add success'
          };    
        }
        connection.release();
        jsonOupt(res, result);
      });
    });

  },

  getCourseInfo: function(req, res, next) {

    var param = req.query || req.params;  
    pool.getConnection(function(err, connection) {

      connection.query($sql.get_courseenroll_count, param.course_id, function(err, result) {

        result[0]['course_id'] = param.course_id;
        result[0]['course_name'] = param.course_name;

        res.render('courseinfo', {
          title: 'courselist',
          result: result
        })
        connection.release();
      });
    });

  }, 

  getEnrollList: function(req, res, next) {
 
    var param = req.query || req.params;  
    pool.getConnection(function(err, connection) {

      connection.query($sql.get_courseenrolllist, param.course_id, function(err, result) {

        res.render('admin_enrolllist', {
          title: 'courselist',
          result: result
        })
        connection.release();
      });
    });
  },

  enroll_commit: function(req, res, next) {
    var param = req.query || req.params;

    async.waterfall([
      function(callback) {
        sql_connection.query($sql.check_user_exist, param.user_id, function(err, result){
          callback(err, result);
        });
      },
      function(arg1, callback) {
        sql_connection.query($sql.check_user_enroll, [param.user_id, param.course_id], 
            function(err, result){
              callback(err, arg1, result);
            });
      },
      function(arg1, arg2, callback){
        if (arg1.length === 0 || arg2.length != 0 ) {
            result = {
              code: 501,
              msg: 'err'
            };
            jsonOupt(res, result);
        } else {
          stuFoo.enroll_commit(req, res, next);
        }

        callback(null, 'done');
      }
    ], function(err, result) {
      //console.log(err);
    })
  },

  queryEnrollById: function(req, res, next) {
    var param = req.query || req.params;
    
    pool.getConnection(function(err, connection) {
      connection.query($sql.get_enroll_byid, [param.course_id, param.user_id], function(err, result) {

        if (Object.keys(result).length === 0) {
            result = {
              flag: '404',
              msg: 'object not found'
            }
        }
 
        jsonOupt(res, result);
        connection.release();
      });
    });
  },


  getLabsList: function(req, res, next) {
    var param = req.query || req.params;
    pool.getConnection(function(err, connection) {
      connection.query($sql.get_labs, param.course_id, function(err, result) {

        res.render('admin_labslist', {
          title: 'courselist',
          result: result
        })
      });
      connection.release();
    });
  },

  updateLabs: function(req, res, next) {
    var param = req.query || req.params;

    var field = '';
    for (var val in param) {
      if (val === 'course_id' || val === 'user_id'){
        ;
      } else {
        var tmp = val + '=' + param[val] + ' ,';
        field += tmp;
      }
    }

    field = field.substr(0, field.length-1);
    
    async.waterfall([
      function(callback) {
        sql_connection.query('UPDATE labs SET ' + field + ' WHERE course_id=' + param.course_id + ' AND stu_id=' + param.user_id, 
          function(err, result) {
            callback(err, result);
          });
      }, 
      function(arg1, callback) {
        sql_connection.query('SELECT * FROM labs WHERE course_id=' + param.course_id + ' AND stu_id=' + param.user_id, 
            function(err, result) {
              callback(err, result);
        });
      },
      function(arg1, callback) {

        var qname_list = ['labA', 'labB', 'labC', 'labD', 'labE'];
        var len = qname_list.length;
        var score = 0;

        for (var i=0; i<len; i++) {
          score += +arg1[0][qname_list[i]];  
        }

        var exec_arr = [];
        var update_labs = 'UPDATE labs SET score=' + score + ' WHERE course_id=' + param.course_id + ' AND stu_id=' + param.user_id;
        var update_scoretrace = 'UPDATE score_trace SET labs=' + score + ' WHERE stu_id=' + param.user_id + ' AND course_id=' + param.course_id;

        exec_arr.push(update_labs);
        exec_arr.push(update_scoretrace);

        async.each(exec_arr, function(item, cb) {
          sql_connection.query(item, function(err, result) {
            if (err) cb(err);
            else {
              console.log(item, ' success');  
              cb()
            };
          });
        }, function (err) {
          if (err) callback(err, null);
          else callback(null, 'done');
        }); 
/*
        sql_connection.query('UPDATE labs SET score=' + score + ' WHERE course_id=' + param.course_id + ' AND stu_id=' + param.user_id,
            function(err, result) {
              jsonOupt(res, result);
              callback(null, 'done');
            });
            */
      }
    ], function(err, result) {
      console.log('update waterfall err: ', err);
      jsonOupt(res, { flag: 200});
      //TODO: err bailout
    });
  },

  queryLabsById: function(req, res, next) {
    var param = req.query || req.params;
    pool.getConnection(function(err, connection) {
      connection.query($sql.get_labs_byid, [param.course_id, param.user_id], function(err, result) {

        if (Object.keys(result).length === 0) {
            result = {
              flag: '404',
              msg: 'object not found'
            }
        }
 
        jsonOupt(res, result);
        connection.release();
      });
    });

    

  },
  
  getHomeworkList: function(req, res, next){
    var param = req.query || req.params;
    pool.getConnection(function(err, connection) {
      connection.query($sql.get_homework, param.course_id, function(err, result) {

        res.render('admin_homeworklist', {
          title: 'courselist',
          result: result
        })
      });
      connection.release();
    });
  
  },

  updatehomework: function(req, res, next) {
    var param = req.query || req.params;

    var field = '';
    for (var val in param) {
      if (val === 'course_id' || val === 'user_id'){
        ;
      } else {
        var tmp = val + '=' + param[val] + ' ,';
        field += tmp;
      }
    }

    field = field.substr(0, field.length-1);
    
    async.waterfall([
      function(callback) {
        sql_connection.query('UPDATE homework SET ' + field + ' WHERE course_id=' + param.course_id + ' AND stu_id=' + param.user_id, 
          function(err, result) {
            callback(err, result);
          });
      }, 
      function(arg1, callback) {
        sql_connection.query('SELECT * FROM homework WHERE course_id=' + param.course_id + ' AND stu_id=' + param.user_id, 
            function(err, result) {
              callback(err, result);
        });
      },
      function(arg1, callback) {

        var qname_list = ['homeworkA', 'homeworkB', 'homeworkC', 'homeworkD', 'homeworkE'];
        var len = qname_list.length;
        var score = 0;

        for (var i=0; i<len; i++) {
          score += +arg1[0][qname_list[i]];  
        }

        var exec_arr = [];
        var update_homework = 'UPDATE homework SET score=' + score + ' WHERE course_id=' + param.course_id + ' AND stu_id=' + param.user_id;
        var update_scoretrace = 'UPDATE score_trace SET homework_score=' + score + ' WHERE stu_id=' + param.user_id + ' AND course_id=' + param.course_id;

        exec_arr.push(update_homework);
        exec_arr.push(update_scoretrace);

        async.each(exec_arr, function(item, cb) {
          sql_connection.query(item, function(err, result) {
            if (err) cb(err);
            else {
              console.log(item, ' success');  
              cb()
            };
          });
        }, function (err) {
          if (err) callback(err, null);
          else callback(null, 'done');
        }); 

/*
        sql_connection.query('UPDATE homework SET score=' + score + ' WHERE course_id=' + param.course_id + ' AND stu_id=' + param.user_id,
            function(err, result) {
              jsonOupt(res, result);
              callback(null, 'done');
            });
*/

      }
    ], function(err, result) {
      console.log('update hw waterfall err: ', err);
      jsonOupt(res, {
        flag: 200
      });
      //TODO: update hw err bailout
    });
  },

  queryHomeworkById: function(req, res, next) {
    var param = req.query || req.params;
    pool.getConnection(function(err, connection) {
      connection.query($sql.get_homework_byid, [param.course_id, param.user_id], function(err, result) {

        if (Object.keys(result).length === 0) {
            result = {
              flag: '404',
              msg: 'object not found'
            }
        }
 
        jsonOupt(res, result);
        connection.release();
      });
    });
  },
 

  getFinalList: function(req, res, next) {
    var param = req.query || req.params;
    pool.getConnection(function(err, connection) {
      connection.query($sql.get_final, param.course_id, function(err, result) {

        res.render('admin_finallist', {
          title: 'courselist',
          result: result
        })
      });
      connection.release();
    });
  },

  updatefinal: function(req, res, next) {
    var param = req.query || req.params;

    var field = '';
    for (var val in param) {
      if (val === 'course_id' || val === 'user_id'){
        ;
      } else {
        var tmp = val + '=' + param[val] + ' ,';
        field += tmp;
      }
    }

    field = field.substr(0, field.length-1);
    
    async.waterfall([
      function(callback) {
        sql_connection.query('UPDATE final SET ' + field + ' WHERE course_id=' + param.course_id + ' AND stu_id=' + param.user_id, 
          function(err, result) {
            callback(err, result);
          });
      }, 
      function(arg1, callback) {
        sql_connection.query('SELECT * FROM final WHERE course_id=' + param.course_id + ' AND stu_id=' + param.user_id, 
            function(err, result) {
              callback(err, result);
        });
      },
      function(arg1, callback) {

        var qname_list = ['qA', 'qB', 'qC', 'qD', 'qE'];
        var len = qname_list.length;
        var score = 0;

        for (var i=0; i<len; i++) {
          score += +arg1[0][qname_list[i]];  
        }

        var exec_arr = [];
        var update_final = 'UPDATE final SET score=' + score + ' WHERE course_id=' + param.course_id + ' AND stu_id=' + param.user_id;
        var update_courseinfo = 'UPDATE course_info SET final_score=' + score + ' WHERE stu_id=' + param.user_id + ' AND course_id=' + param.course_id;

        exec_arr.push(update_final);
        exec_arr.push(update_courseinfo);

        async.each(exec_arr, function(item, cb) {
          sql_connection.query(item, function(err, result) {
            if (err) cb(err);
            else {
              console.log(item, ' success');  
              cb()
            };
          });
        }, function (err) {
          if (err) callback(err, null);
          else callback(null, 'done');
        }); 
      }
    ], function(err, result) {
      console.log('update final waterfall err: ', err);
      jsonOupt(res, null);
      //TODO: update hw err bailout
    });
  },

  queryFinalById: function(req, res, next) {
    var param = req.query || req.params;
    pool.getConnection(function(err, connection) {
      connection.query($sql.get_final_byid, [param.course_id, param.user_id], function(err, result) {

        if (Object.keys(result).length === 0) {
            result = {
              flag: '404',
              msg: 'object not found'
            }
        }
 
        jsonOupt(res, result);
        connection.release();
      });
    });
  },


  updateAllfinalPage: function(req, res, next) {
    var param = req.query || req.params;

    pool.getConnection(function(err, connection) {
      connection.query($sql.get_final, param.course_id, function(err, result) {

        res.render('admin_update_final_middle', {
          title: 'courselist',
          result: result
        })
      });
      connection.release();
    });
  },

  updateAllfinal: function(req, res, next) {
    var param = req.query || req.params;
    var data = req.body;
    var course_id = param.course_id;

    var exec_arr = [];
    var regexp = new RegExp('\\[(.*)\\]');

    var id_log_set = new Set();

    for (var val in data) {
      if (data[val].length != 0) {
        id_endidx = val.match(regexp)['index'];
        key = val.match(regexp)[1];
        value = data[val];
        var field = key + '=' + value;
        var stu_id = val.substr(0, id_endidx);
        var insertsql_cmd = gen_update_final_sql(field, stu_id, course_id);
        exec_arr.push(insertsql_cmd);
        id_log_set.add(stu_id);
      }
    }

    //console.log(exec_arr);

    async.waterfall([
        function(callback) {
          async.each(exec_arr, function(item, callback) {
            sql_connection.query(item, function(err, result) {
              if (err) callback(err);
              //console.log(item + ' success');
              callback(null);
            });
          }, function(err) {
            if (err) console.log('update all final err: ', err);
            var query_arr = [];
            var id_log = Array.from(id_log_set);
            
            for (var i = 0, len = id_log.length; i < len ; i++) {
              var cmd = 'SELECT * FROM final WHERE stu_id=' + id_log[i] + ' AND course_id=' + course_id;
              query_arr.push(cmd);
            }

            callback(null, query_arr);
          });
        }, 
        function(query_arr, callback){

          var update_score_list = [];
          async.each(query_arr, function(item, callback) {
            sql_connection.query(item, function(err, result) {
              if (err) callback(err);

              var qname_list = ['qA', 'qB', 'qC', 'qD', 'qE'];
              var score = 0;

              for (var i = 0, len = qname_list.length; i < len; i++) {
                score += result[0][qname_list[i]];
              }

              var cmd = 'UPDATE final SET score=' + score + ' WHERE stu_id=' + result[0]['stu_id'] + ' AND course_id=' + course_id;
              var update_courseinfo_cmd = 'UPDATE course_info SET final_score=' + score + ' WHERE stu_id=' + result[0]['stu_id'] + ' AND course_id=' + course_id;
              //console.log(cmd);
              update_score_list.push(cmd); 
              update_score_list.push(update_courseinfo_cmd); 
              callback(null);
            });

          }, function(err) {
            if (err) console.log('final query err: ', err);
            callback(null, update_score_list);
          });
        },

        function(uplist, callback) {
          //console.log('uplist:', uplist);
          async.each(uplist, function(item, callback) {
            sql_connection.query(item, function(err, result) {
              if (err) callback(err);
              //console.log(item + ' success');
              callback(null);
            });
          }, function(err) {
            if (err) console.log('update all final err: ', err);
            callback(null, 'done');
          });
        }

    ], function(err, result) {
      if (err) console.log('update final all water fall err: ', err);
      else { 
        console.log(result);
        result = {
          code: 200,
          msg: 'success!'
        };
        jsonOupt(res, result);
      }
    });

  },

  get_attend: function(req, res, next) {
    var param = req.query || req.params;

    pool.getConnection(function(err, connection) {
      connection.query($sql.get_attend, param.course_id, function(err, result) {
          var tmp = result;

          for (var rows = 0, len = tmp.length; rows < len; rows++) {
            each_row = tmp[rows];
            for (var val in each_row) {
              if (val != 'stu_id' && val != 'username'){
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

          res.render('attendlist',{
            title:'courselist',
            result:result
          });
 
        });
        connection.release();
      });
  },

  updateAttend: function(req, res, next) {
    var param = req.query || req.params;
    var data = req.body;
    var course_id = param.course_id;
    var field = '';

    for (var val in data) {
      if (data[val] != 0 && val != 'stu_id' ) {
        var tmp =  val + '=' + data[val] + ', ';
        field += tmp;
      }
    }

    field = field.substr(0, field.length-2);

    if (field.length === 0) {
      jsonOupt(res, { affectedRows: 0 } );
    } else {
      var sql_cmd = 'UPDATE attend SET ' + field + ' WHERE stu_id=' + data.stu_id + ' AND course_id=' + course_id;
      pool.getConnection(function(err, connection) {
        connection.query(sql_cmd, function(err, result) {
            jsonOupt(res, result); 
          });
        connection.release();
      });
    }

  },

  queryAttendById: function(req, res, next) {
    var param = req.query || req.params;

    pool.getConnection(function(err, connection) {
      connection.query($sql.get_attend_byid, [param.course_id, param.user_id], function(err, result) {

        if (Object.keys(result).length === 0) {
            result = {
              flag: '404',
              msg: 'object not found'
            }
        }
 
        jsonOupt(res, result);
        connection.release();
      });
    });
  },

  getInfoList: function(req, res, next) {
    var param = req.query || req.params;

    pool.getConnection(function(err, connection) {
      connection.query($sql.get_info, param.course_id, function(err, result) {
        
        res.render('admin_infolist', {
          title: 'courselist',
          result: result
        });
        
        connection.release();
      });
    });
  },

  queryInfo: function(req, res, next) {
    var param = req.query || req.params;

    pool.getConnection(function(err, connection) {
      connection.query($sql.get_info_byid, [param.course_id, param.user_id], function(err, result) {
        if (Object.keys(result).length === 0) {
          result = {
            flag: '404',
            msg: 'object not found'
          }
        }
        jsonOupt(res, result); 
      });
        connection.release();
      });
    
  },

  getTraceList: function(req, res, next) {
    var param = req.query || req.params;
    pool.getConnection(function(err, connection) {
      connection.query($sql.get_trace, param.course_id, function(err, result) {

        res.render('admin_scoretrace_list', {
          title: 'courselist',
          result: result
        });

        connection.release();
      });
    });
  },


  queryTraceById: function(req, res, next) {
   var param = req.query || req.params;

    pool.getConnection(function(err, connection) {
      connection.query($sql.get_trace_byid, [param.course_id, param.user_id], function(err, result) {
        if (Object.keys(result).length === 0) {
            result = {
              flag: '404',
              msg: 'object not found'
            }
        }
 
        jsonOupt(res, result); 
        connection.release();
      });
    });

  },



  updateAttendScore: function(req, res, next) {
    var param = req.query || req.params;
    var course_id = param.course_id;
    var up_score = +param.co_score;

    async.waterfall([
        function(callback) {
          sql_connection.query($sql.get_attend, course_id, function(err, result) {
            callback(null, result);
          });
        },
        function(attend_result, callback) {
          // if value > 0 => not attend, if value < 0 => attend
          var count_obj = {};
          var exec_arr = [];
          var enroll_count = attend_result.length;
          var qname_list = ['weekA', 'weekB', 'weekC', 'weekD', 'weekE', 'weekF', 'weekG', 'weekH', 'weekI', 'weekJ'];
          var qname_list_len = qname_list.length;

          for (var i=0; i < enroll_count; i++) {
            count_obj[attend_result[i]['stu_id']] = 0;
            for (var inner=0; inner < qname_list_len; inner++) {
              var name = qname_list[inner];
              if (attend_result[i][name] < 0) {
                count_obj[attend_result[i]['stu_id']] += up_score;
              } 
            }
          }

          for (var val in count_obj) {
            var sql_cmd = 'UPDATE score_trace SET attendance_score=' + count_obj[val] + 
              ' WHERE stu_id=' + val + ' AND course_id=' + course_id; 
            exec_arr.push(sql_cmd);
          }


          callback(null, exec_arr);
        },
        function(exec_arr, callback) {
          async.each(exec_arr, function(item, cb) {
            sql_connection.query(item, function(err, result) {
              if (err) cb(err);
              else {
                console.log(item, ' success');  
                cb()
              };
            });
          }, function (err) {
            if (err) callback(err, null);
            else callback(null, 'done');
          }); 
        }
    ], function(err, result) {
      if (err) console.log('update AttendScore waterfall err: ', err);
      else console.log(result);
      jsonOupt(res, { flag: 200 });
    });
  },

  reloadInfoList: function(req, res, next) {
    var param = req.query || req.params;
    var course_id = param.course_id;

    async.waterfall([
        function(callback) {
          sql_connection.query($sql.get_trace, param.course_id, function(err, result) {
            callback(null, result); 
          });
        },
        function(trace_result, callback) {
          var exec_arr = [];
          var qname_list = ['attendance_score', 'homework_score', 'labs'];

          for (var i = 0, len = trace_result.length ; i < len; i++) {
             
             var score = 0;
             var stu_id = trace_result[i]['stu_id'];
             for (var inner = 0, inner_len = qname_list.length; inner < inner_len; inner++) {
                var name = qname_list[inner];
                score += trace_result[i][name];
             }
            
             var sql_cmd = 'UPDATE course_info SET as_score=' + score + ' WHERE stu_id=' + stu_id + ' AND course_id=' + course_id;
             exec_arr.push(sql_cmd);
          }

          callback(null, exec_arr);
        },
        function(exec_arr, callback) {
          async.each(exec_arr, function(item, cb) {
            sql_connection.query(item, function(err, result) {
              if (err) cb(err);
              else {
                console.log(item, ' success');  
                cb()
              };
            });
          }, function (err) {
            if (err) callback(err, null);
            else callback(null, 'done');
          }); 

        }
    ], function(err, result) {
      if (err) console.log('reload info list waterfall err:', err); 
      else { 
        jsonOupt(res, null);
        console.log(result)
      };
    });
  },

  setPer: function(req, res, next) {
    var param = req.query || req.params;
    var course_id = param.course_id;
    var as_per = param.as_score_per;
    var final_per = param.final_score_per;

    async.waterfall([
      function(callback) {
        sql_connection.query($sql.get_info, course_id, function(err, result) {
          callback(null, result);
        });           
      },
      function(info_result, callback) {
        var exec_arr = [];
        
        for (var i=0, len=info_result.length; i<len; i++) {
          var as_score = info_result[i]['as_score'];
          var final_score = info_result[i]['final_score'];
          var score = as_score * as_per + final_score * final_per;
          var sql_cmd = 'UPDATE course_info SET grade=' + score.toFixed(1) + 
            ' WHERE stu_id=' + info_result[i]['stu_id'] +  ' AND course_id=' + course_id; 
          exec_arr.push(sql_cmd);
        }

        callback(null, exec_arr);
      },
         function(exec_arr, callback) {
          async.each(exec_arr, function(item, cb) {
            sql_connection.query(item, function(err, result) {
              if (err) cb(err);
              else {
                console.log(item, ' success');  
                cb()
              };
            });
          }, function (err) {
            if (err) callback(err, null);
            else callback(null, 'done');
          }); 
        }
   
    ], function(err, result) {
      if (err) console.log('set per waterfall err:', err);
      else console.log(result);
    });
  
  },
  
  getWaitingConfirmUser: function(req, res, next) {
    pool.getConnection(function(err, connection) {
      connection.query($sql.get_waitinguser, function(err, result) {
        res.render('admin_confirmuser', { title: "admin_confirmuser", result: result });
      });  

      connection.release();
    });
  },

  confirmUser: function(req, res, next) {
    var params = req.body;

    pool.getConnection(function(err, connection) {
      connection.query($sql.update_userstatus, params.id, function(err, result) {
        jsonOupt(res, result);
      });  

      connection.release();
    });
  },

}
