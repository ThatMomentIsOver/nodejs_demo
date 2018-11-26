var admin_panel = { 
  get_courselist: 'SELECT * FROM courselist',
  get_courseenroll_count: 'SELECT COUNT(*) FROM course_info WHERE course_id=?',
  get_courseenrolllist: 'SELECT * FROM course_info INNER JOIN users ON users.id=course_info.stu_id WHERE course_id=?',
  get_enroll_byid: 'SELECT * FROM course_info INNER JOIN users ON users.id=course_info.stu_id WHERE course_id=? AND course_info.stu_id=?',

  get_attend: 'SELECT * FROM attend INNER JOIN users ON users.id=attend.stu_id WHERE course_id=?',
  get_attend_byid: 'SELECT * FROM attend INNER JOIN users ON users.id=attend.stu_id WHERE course_id=? AND attend.stu_id=?',
  get_labs: 'SELECT * FROM labs INNER JOIN users ON users.id=labs.stu_id WHERE course_id=?',
  get_labs_byid: 'SELECT * FROM labs INNER JOIN users ON users.id=labs.stu_id WHERE course_id=? AND labs.stu_id=?',
  get_homework: 'SELECT * FROM homework INNER JOIN users ON users.id=homework.stu_id WHERE course_id=?',
  get_homework_byid: 'SELECT * FROM homework INNER JOIN users ON users.id=homework.stu_id WHERE course_id=? AND homework.stu_id=?',
  get_score_trace: 'SELECT * FROM score_trace INNER JOIN users ON users.id=score_trace.stu_id WHERE course_id=?',
  get_final: 'SELECT * FROM final INNER JOIN users ON users.id=final.stu_id WHERE final.course_id=?',
  get_final_byid: 'SELECT * FROM final INNER JOIN users ON users.id=final.stu_id WHERE course_id=? AND final.stu_id=?',
  get_info: 'SELECT * FROM course_info INNER JOIN users ON users.id=course_info.stu_id WHERE course_info.course_id=?',
  get_info_byid: 'SELECT * FROM course_info INNER JOIN users ON users.id=course_info.stu_id WHERE course_info.course_id=? AND course_info.stu_id=?',
  get_trace: 'SELECT * FROM score_trace INNER JOIN users ON users.id=score_trace.stu_id WHERE score_trace.course_id=?',
  get_trace_byid: 'SELECT * FROM score_trace INNER JOIN users ON users.id=score_trace.stu_id WHERE course_id=? AND stu_id=?',
  
  add_course: 'INSERT INTO courselist (id, name) VALUE (?, ?)', 
  get_waitinguser: 'SELECT id, username, github_id, google_id, status FROM users WHERE status="waiting"',
  update_userstatus: 'UPDATE users SET status="pass" WHERE id=?',

  del2courselist: 'DELETE FROM courselist WHERE id=?',
  del2course_info: 'DELETE FROM course_info WHERE course_id=?',
  del2attend: 'DELETE FROM attend WHERE course_id=?',
  del2homework: 'DELETE FROM homework WHERE course_id=?',
  del2labs: 'DELETE FROM labs WHERE course_id=?',
  del2score_trace: 'DELETE FROM score_trace WHERE course_id=?',
  del2final: 'DELETE FROM final WHERE course_id=?',

  check_user_exist: 'SELECT * FROM users WHERE id=?',
  check_user_enroll: 'SELECT * FROM course_info WHERE stu_id=? AND course_id=?',


};

module.exports = admin_panel;
