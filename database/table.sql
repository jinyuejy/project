
CREATE table people(
    sno CHAR(10),
    sanme CHAR(20),
    ssex CHAR(4),
    sage CHAR(4),
    PRIMARY KEY(sno)
);
-- GRANT ALL PRIVILEGES ON TABLE people to exedbo
--创建学生表

INSERT
into student
VALUES
('1710650103','崔文豪','男',21),
('1710650104','纪辉颖','男',20);


SELECT *
from people;