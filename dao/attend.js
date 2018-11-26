var mysql = require('mysql');
var $conf = require('../conf/conf');
// var $util = require('../util/util');
var $sql = require('./attendSQLMapping.js');

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

module.exports = {
	addAttendUser: function (req, res, next) {
		pool.getConnection(function(err, connection) {
			var param = req.query || req.params;  // use query function (express) trace params

			connection.query($sql.insert, param.id, function(err, result) {
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
				jsonOupt(res, result);
				connection.release();
			});
		});
	},

  deleteAttendUserById: function (req, res, next) {
		pool.getConnection(function(err, connection) {
			var id = +req.query.id;
			connection.query($sql.delete, id, function(err, result) {
        if(result.affectedRows > 0) {
					result = {
						code: 200,
						msg:'删除成功'
					};
				} else {
					result = void 0;
				}
				jsonOupt(res, result);
				connection.release();
			});
		});
  },

  queryAttendById: function (req, res, next) {
		var id = +req.query.id; 
		pool.getConnection(function(err, connection) {
			connection.query($sql.queryAttendById, id, function(err, result) {
        if (Object.keys(result).length === 0) {
            result = {
              flag: '404',
              msg: 'object not found'
            }
        }
        tmp = result[0];

        for (var val in tmp) {
          if (val != 'id' && val != 'name'){
            var air = tmp[val];
            if(!air || air === 0) {
              tmp[val] = '-';
            } else if(air > 0) {
              tmp[val] = 'x';
            } else {
              tmp[val] = '✓';
            }
          }
        }

          console.log('===', tmp);
          jsonOupt(res, result);
          connection.release();
        });
      });
    },

    queryAllAttend: function (req, res, next) {
      pool.getConnection(function(err, connection) {
        connection.query($sql.queryAllAttend, function(err, result) {

          //result filter

          var tmp = result;

          for (var rows = 0, len = tmp.length; rows < len; rows++) {
            each_row = tmp[rows];
            for (var val in each_row) {
              if (val != 'id' && val != 'name'){
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
            title:'AttendList',
            result:result
          });
          connection.release();
        });
      });
    },

    updateAttendUser: function (req, res, next) {
      var param = req.body;

      pool.getConnection(function(err, connection) {
        connection.query($sql.update, [param.weekA, param.weekB, param.weekC,
            param.weekD, param.weekE, param.weekF, param.weekG, param.weekH,
            param.weekI, param.weekJ, param.id], 
            function(err, result) {
              jsonOupt(res, result);
              connection.release();
            });
      });

    }


  };

