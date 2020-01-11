import dbconn
dsn='host=localhost dbname=csdb user=hopers password=hope'
pool=dbconn.psycopg2.pool.ThreadedConnectionPool(1,20,dsn)

conn=pool.getconn()

sql='''
    select sno,sname,password
    from student
    '''

with conn.cursor() as cur:
    cur.execute(sql)

    result=cur.fetchall()

ssno=[]
sinfor=[]
for row in result:
    ssno.append(row[0])
    sinfor.append([row[1],row[2]])

print(dict(zip(ssno,sinfor)))

## 测试内容
