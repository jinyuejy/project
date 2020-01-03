import psycopg2.pool as py
import psycopg2.extras
import time,json,web,dbconn
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
        sql='''
        select cno
        from course
        '''
        list_cno=[]
        conn=self.pool.getconn()
        with conn.cursor() as cur:
            cur.execute(sql)
            result=cur.fetchall()
        self.pool.putconn(conn)
        for i in result:
            list_cno.append(str(i[0]))
        ##判断是否为新增
        if arg in list_cno:
            try:
                cou=self.read_json()
            except:
                cou=' '
            print('cou1:',arg)
            cno=cou.get('cno')
            self.get(cno)
        else:
            self.post_add(arg)

    def post_add(self,arg):
        print('cou2:',arg)
        cou=self.read_json()
        if not cou.get('coptipn'):
            cou['coption']='一般'
        if not cou.get('cnature'):
            cou['cnature']='必修'
        if not cou.get('ptb'):
            cou['ptb']='第一公共教学楼'
        with self.db_cursor() as cur:
            sql = '''
            INSERT 
            INTO course(cno,cname,ordn,credit,cnature,coption)
            VALUES(%s, %s, %s, %s,%s,%s);
            '''
            data=[cou['cno'],cou['cname'],cou['ordn'],cou['credit'],cou['cnature'],cou['coption']]
            cur.execute(sql,data)

        with self.db_cursor() as dc:
            sql = '''
            INSERT 
            INTO course_time(cno,day,ctime,ptb,room)
            VALUES(%s, %s, %s, %s,%s);
            '''
            data=[cou['cno'],cou['day'],cou['ctime'],cou['ptb'],cou['room']]

            dc.execute(sql,data)
            self.write_json(cou)
        
        


    def put(self,args):
        cou = self.read_json()
        cno=args
        cou['ptb']='第一公共教学楼'
        with self.db_cursor() as cur:
            sql = ''' 
            UPDATE course SET 
            cno=%s,cname=%s,ordn=%s, credit=%s
            WHERE cno=%s;
            '''
            cur.execute(sql, [cou['cno'],cou['cname'],cou['ordn'],int(cou['credit']),cno])
            cur.commit()

        with self.db_cursor() as cur:
            sql = ''' 
            UPDATE course_time SET 
            cno=%s,day=%s,ctime=%s, ptb=%s,room=%s
            WHERE cno=%s;
            '''
            cur.execute(sql, [cou['cno'],cou['day'],cou['ctime'],cou['ptb'],cou['room'],cno])
            cur.commit()
            self.write_json(cou)



    def delete(self, args):
        print('args:',args)
        with self.db_cursor() as cur:
            sql = '''DELETE 
            FROM course 
            WHERE cno= %s'''
            cur.execute(sql, [args])

