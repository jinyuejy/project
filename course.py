import psycopg2.pool as py
import psycopg2.extras
import tornado.web
import asyncio,time,json,web,dbconn
asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
import os
class course(web.RestHandler):
    dsn="host=localhost dbname=csdb user=hopers password=hope"
    pool = py.ThreadedConnectionPool(1, 20, dsn)
    def get(self,arg):
        conn = self.pool.getconn()
        sql = '''
        select course.cno,cname,credit,ptb,room,day,ctime
        from course,course_time
        where course.cno=course_time.cno
        '''
        if arg:
            sql=sql+" and course.cno=%s"
        with conn.cursor(cursor_factory=psycopg2.extras.NamedTupleCursor) as cur:
            cur.execute(sql,[arg])
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


    def post(self,arg):
        try:
            cou=self.read_json()
        except:
            cou=' '
        cno=cou.get('cno')
        self.get(cno)


    def put(self,args):
        cou = self.read_json()
        cno=args
        with self.db_cursor() as cur:
            sql = ''' 
            UPDATE course SET 
            cno=%s,cname=%s,ordn=%s, credit=%s
            WHERE cno=%s;
            '''
            cur.execute(sql, [cou['cno'],cou['cname'],cou['ordn'],int(cou['credit']),cno])
            cur.commit()

        self.write_json(cou)


    def delete(self, args):
        print('args:',args)
        with self.db_cursor() as cur:
            sql = '''DELETE 
            FROM course 
            WHERE cno= %s'''
            cur.execute(sql, [args])

