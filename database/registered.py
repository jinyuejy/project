import submitdata
from time import time
t=time()
dsn='host=localhost dbname=csdb user=hopers password=hope'
# file='registered.xlsx'
# sql='''
#     insert 
#     into student
#     values(%s,%s,%s)
# '''

# submitdata.submit(dsn,sql,file)
file='information.xlsx'

sql='''
insert 
into course_time
values(%s,%s,%s,%s,%s)
'''
submitdata.submit(dsn,sql,file,3)
print('本次用时：',time()-t)