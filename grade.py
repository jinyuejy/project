import psycopg2.pool as py
import psycopg2.extras
import time,json,web,dbconn

class grade(web.RestHandler):
    dsn="host=localhost dbname=csdb user=hopers password=hope"
    pool = py.ThreadedConnectionPool(1, 20, dsn)
    def get(self,*args):
        print('args:',args)
        sql='''
        select grade.sno,grade.cno,cname,credit,grade
        from student,course,grade
        where grade.sno=student.sno and course.cno=grade.cno
        '''
        if args[0]:
            sql+=' and student.sno=%s and course.cno=%s'

        conn=self.pool.getconn()
        with conn.cursor() as cur:
            cur.execute(sql,[args[0],args[1]])
            result = cur.fetchall()
            des=cur.description
            conn.commit()
        self.pool.putconn(conn)


        name = []
        for item in des:
            name.append(item[0])

        final = []
        for row in result:
            u = dict(zip(name, list(row)))
            final.append(u)

        self.write_json(final)