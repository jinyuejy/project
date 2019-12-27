import psycopg2
conn=psycopg2.connect(host='localhost',database='exedb',user='exedbo',password='xp')
cur=conn.cursor()
cur.execute('''
create table people(
    sn integer,
    name text
);
''')

conn.commit()

