import submitdata
from time import time
t=time()
dsn='host=localhost dbname=csdb user=hopers password=hope'
file='information.xlsx'

sql='''
insert 
into student
values(%s,%s,%s,%s,%s)
'''
submitdata.submit(dsn,sql,file,0,None)
print('本次用时：',time()-t)

#   学生信息录入


sql='''
insert 
into course
values(%s,%s,%s,%s,%s)
'''
submitdata.submit(dsn,sql,file,2,3)

# 课程信息录入

sql='''
insert
into grade
values(%s,%s,%s)
'''
submitdata.submit(dsn,sql,file,1,2)

#成绩信息录入

sql='''
insert
into course_time
values(%s,%s,%s,%s,%s)
'''

submitdata.submit(dsn,sql,file,3)

# 课程时间以及位置信息

sql='''
insert
into teacher
values(%s,%s,%s,%s)
'''

submitdata.submit(dsn,sql,file,4)

# 教师信息录入