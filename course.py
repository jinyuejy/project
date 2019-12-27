import psycopg2.pool as py
import psycopg2.extras
import tornado.web
import asyncio,time,json,web,dbconn
asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
import os
class course(web.RestHandler):
    dsn="host=localhost dbname=csdb user=hopers password=hope"
    pool = py.ThreadedConnectionPool(1, 20, dsn)
    def get(self,path):
        try:
            cname=self.get_argument('cname')
            print('cname:',cname)
        except:
            cname=''
            print('cname:','xxxxx')
        conn = self.pool.getconn()
        sql = '''
        select course.cno,cname
        from course,course_time
        where course.cno=course_time.cno
        '''
        with conn.cursor(cursor_factory=psycopg2.extras.NamedTupleCursor) as cur:
            cur.execute(sql)
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
        # return final

    def post(self,cname):
        name=self.get_argument('cname')
        print(name)
        sql = '''
        select course.cno,cname
        from course,course_time
        where course.cno=course_time.cno and course.cno='10610482'
        '''
        with self.db_cursor() as cur:
            cur.execute(sql)
            self.write_json(cur.fetchall_dicts())


