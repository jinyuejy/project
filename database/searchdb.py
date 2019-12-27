import psycopg2

conn=psycopg2.connect(host='localhost',database='exedb',user='exedbo',password='xp') #连接数据库

cur=conn.cursor()  #创建光标

cur.execute('''
    select *
    from people;
''')
print('学号''  ''姓名''  ''性别''  ''年龄')
for row in cur:
    print('%s  %s  %s  %s'% (row[0],row[1],row[2],row[3]))

conn.commit()   #事务提交

