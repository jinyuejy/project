import psycopg2.pool as py
import psycopg2.extras
import time,json,web,dbconn

class grade(web.RestHandler):
    dsn="host=localhost dbname=csdb user=hopers password=hope"
    pool = py.ThreadedConnectionPool(1, 20, dsn)
    def get(self,*args):
        user=self.get_user()
        print('user:',user,type(user))
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

        final.append({'nowuser':user})

        self.write_json(final)

    def post(self,*arg):
        print('cou2:',arg)
        grade=self.read_json()
        with self.db_cursor() as dc:
            sql = '''
            INSERT 
            INTO grade(sno,cno,grade)
            VALUES(%s, %s, %s);
            '''
            data=[grade['sno'],grade['cno'],grade['grade']]
            dc.execute(sql,data)
            self.write_json(grade)


    def put(self,*args):
        grade=self.read_json()
        sno=args[0]
        cno=args[1]
        sql='''
        update grade set
        cno=%s,sno=%s,grade=%s
        where sno=%s and cno=%s
        '''
        with self.db_cursor() as cur:
            data=[grade['cno'],grade['sno'],grade['grade'],sno,cno]
            cur.execute(sql,data)
            cur.commit()

        self.write_json(grade)


    def delete(self, *args):
        print('args:',args)
        with self.db_cursor() as cur:
            sql = '''DELETE 
            FROM grade 
            WHERE cno= %s and sno=%s'''
            cur.execute(sql, [args[1],args[0]])