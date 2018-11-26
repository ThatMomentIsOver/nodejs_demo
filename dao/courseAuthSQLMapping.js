var courseauth = {
  creat: 'CREATE TABLE course(stu_id INT, stu_name VARCHAR(100), status INT, primary key(stu_id)) default charset=utf8 ',
  insert_user: 'INSERT INTO course(course_id, stu_id, stu_name, status) VALUES(?, ?, ?, ?)',

  // enroll course
  insert2course_info: 'INSERT INTO course_info (stu_id, course_id) VALUE (?, ?)',
  insert2attend: 'INSERT INTO attend (stu_id, course_id) VALUE (?, ?)',
  insert2homework: 'INSERT INTO homework (stu_id, course_id) VALUE (?, ?)',
  insert2labs: 'INSERT INTO labs (stu_id, course_id) VALUE (?, ?)',
  insert2score_trace: 'INSERT INTO score_trace (stu_id, course_id) VALUE (?, ?)',
  insert2final: 'INSERT INTO final(stu_id, course_id) VALUE (?, ?)',

  //quit course
  quit2course_info: 'DELETE FROM course_info WHERE stu_id=? AND course_id=?',
  quit2attend: 'DELETE FROM attend WHERE stu_id=? AND course_id=?',
  quit2homework: 'DELETE FROM homework WHERE stu_id=? AND course_id=?',
  quit2labs: 'DELETE FROM labs WHERE stu_id=? AND course_id=?',
  quit2score_trace: 'DELETE FROM score_trace WHERE stu_id=? AND course_id=?',
  quit2final: 'DELETE FROM final WHERE stu_id=? AND course_id=?',

  queryenroll: 'SELECT stu_id FROM score_trace WHERE course_id=?',
  querynameByID: 'SELECT username FROM USERS WHRER id=?',

  get_grade: 'SELECT * FROM course_info INNER JOIN courselist ON course_id = id WHERE course_info.stu_id=?',
  get_attend: 'SELECT * FROM attend INNER JOIN courselist ON attend.course_id=courselist.id WHERE attend.stu_id=?',
  get_homework: 'SELECT * FROM homework INNER JOIN courselist ON course_id=id WHERE homework.stu_id=?',
  get_labs: 'SELECT * FROM labs INNER JOIN courselist ON course_id=id WHERE labs.stu_id=?',
  get_final: 'SELECT * FROM final INNER JOIN courselist ON course_id=id WHERE final.stu_id=?'
};

module.exports = courseauth;
