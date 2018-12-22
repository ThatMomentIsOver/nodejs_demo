create database user;
use user;

create table attend (
stu_id INT,
course_id INT,
weekA INT,
weekB INT,
weekC INT,
weekD INT,
weekE INT,
weekF INT,
weekG INT,
weekH INT,
weekI INT,
weekJ INT,
PRIMARY KEY (stu_id, course_id)
) DEFAULT CHARSET=utf8;

create table course_info (
stu_id INT,
course_id INT,
as_score INT,
final_score INT,
grade INT,
PRIMARY KEY (stu_id, course_id)
) DEFAULT CHARSET=utf8;

create table courselist (
id INT,
name VARCHAR(100),
PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;

create table final (
stu_id INT,
course_id INT,
qA INT,
qB INT,
qC INT,
qD INT,
qE INT,
score INT,
PRIMARY KEY (stu_id, course_id)
) DEFAULT CHARSET=utf8;

create table homework(
stu_id INT,
course_id INT,
homeworkA INT,
homeworkB INT,
homeworkC INT,
homeworkD INT,
homeworkE INT,
score INT,
PRIMARY KEY (stu_id, course_id)
) DEFAULT CHARSET=utf8;


create table labs(
stu_id INT,
course_id INT,
labA INT,
labB INT,
labC INT,
labD INT,
labE INT,
score INT,
PRIMARY KEY (stu_id, course_id)
) DEFAULT CHARSET=utf8;


create table score_trace (
stu_id INT,
course_id INT,
attendance_score INT,
homework_score INT,
labs INT,
PRIMARY KEY (stu_id, course_id)
) DEFAULT CHARSET=utf8;

create table users (
id INT,
username VARCHAR(100),
password VARCHAR(100),
permission VARCHAR(10),
github_id VARCHAR(50),
google_id VARCHAR(50),
status VARCHAR(20),
PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;

INSERT INTO users (id, username, password, permission, status) VALUE (0, "root", "root", "root", "pass")
