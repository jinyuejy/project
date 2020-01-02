DROP TABLE if EXISTS student;
CREATE TABLE student(
    sno char(10),
    sname CHARACTER VARYING(25),
    ssex CHAR(2),
    PASSWORD CHARACTER VARYING(15),
    rd date,                     --注册时间
    PRIMARY KEY(sno)
);

-- 学生表
DROP table IF EXISTS course;
CREATE TABLE course(
    cno CHAR(8),
    cname CHARACTER VARYING(50),
    ordn CHAR(2),                                      --课序号
    credit INT,
    cnature CHAR(4),
    coption CHAR(4),                                   --选修还是必修
    PRIMARY KEY(cno)
);

-- 课程表
DROP table IF EXISTS grade;
CREATE TABLE grade (
    sno CHAR(10),
    cno CHARACTER VARYING(15),
    grade FLOAT(4),
    PRIMARY KEY(sno,cno),
    FOREIGN KEY(sno) REFERENCES student(sno) on DELETE CASCADE ON UPDATE CASCADE ,
    FOREIGN KEY(cno) REFERENCES course(cno) on DELETE CASCADE ON UPDATE CASCADE 
);

-- 成绩表单，无实际意义，主要用于连接S-C
DROP table IF EXISTS course_time;
CREATE TABLE course_time(
    cno CHARACTER VARYING(15),
    day CHARACTER VARYING(50),             --周几
    ctime CHARACTER VARYING(8),           --第几大节课
    ptb CHAR(14),             --第几公共教学楼
    room CHAR(4),             -- 例A103
    PRIMARY KEY(cno,day,ctime),
    FOREIGN KEY (cno) REFERENCES course(cno) on DELETE CASCADE ON UPDATE CASCADE 
);

DROP table IF EXISTS teacher;
CREATE TABLE teacher(
    tno CHAR(11),
    tname CHARACTER VARYING(25),
    password CHARACTER VARYING(15),
    cno CHARACTER VARYING(15),
    PRIMARY KEY(tno),
    FOREIGN KEY (cno) REFERENCES course(cno) on DELETE CASCADE ON UPDATE CASCADE 
);

-- 教师信息










DROP table IF EXISTS registered;