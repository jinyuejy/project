import psycopg2.pool as py
import time
import tornado.web
import tornado.ioloop

t=time.time()

dsn='host=localhost dbname=examdb user=examdbo password=pass'
conn_pool={}

class studenthandler(tornado.web.RequestHandler):
    def get_connpool(self):
        pool=py.ThreadedConnectionPool(1,20,dsn)
        return pool
    
    def select(self,sn):
        sql='''
        select sno,sname
        from student
        '''
        pool=self.get_connpool()
        conn=pool.getconn()
        cur=conn.cursor()
        cur.execute(sql)
        result=cur.fetchall()


