drop DATABASE IF EXISTS exedb;
drop role if EXISTS exedbo;
DROP DATABASE IF EXISTS mydb
DROP role IF EXISTS mydbo
-- drop TABLE course;
-- drop TABLE sc;
-- DROP TABLE student;

create role hopers WITH
  LOGIN PASSWORD 'hope'
  NOSUPERUSER 
  NOCREATEROLE 
  NOCREATEDB
  INHERIT;

CREATE DATABASE CSDB with OWNER = hopers;    --CSDB是指课程系统数据库