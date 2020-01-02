import psycopg2.pool as py
import psycopg2.extras
import time,json,web,dbconn

class grade(web.RestHandler):
    dsn="host=localhost dbname=csdb user=hopers password=hope"
    pool = py.ThreadedConnectionPool(1, 20, dsn)
    def get(self,*args):
        conn=self.pool.getconn()
        user=self.get_user()
        if user not in ['1710650105']:
            sno=user
            cno=args[1]
        else:
            sno=args[0]
            cno=args[1]
        sql='''
        select grade.sno,grade.cno,cname,credit,grade
        from student,course,grade
        where grade.sno=student.sno and course.cno=grade.cno
        '''
        if args[0] and args[1]:
            sql+=' and student.sno=%s and course.cno=%s'
            with conn.cursor() as cur:
                cur.execute(sql,[sno,cno])
                result = cur.fetchall()
                des=cur.description
                conn.commit()
            self.pool.putconn(conn)
        elif args[0]:
            sql+=' and student.sno=%s'
            with conn.cursor() as cur:
                cur.execute(sql,[sno])
                result = cur.fetchall()
                des=cur.description
                conn.commit()
            self.pool.putconn(conn)
        elif args[1]:
            sql+=' and course.cno=%s'
            with conn.cursor() as cur:
                cur.execute(sql,[cno])
                result = cur.fetchall()
                des=cur.description
                conn.commit()
            self.pool.putconn(conn)
        else:
            with conn.cursor() as cur:
                cur.execute(sql)
                result = cur.fetchall()
                des=cur.description
                conn.commit()
            self.pool.putconn(conn)


        name = []
        for item in des:
            name.append(item[0])
        name.append('nowuser')
        final = []
        for row in result:
            z=list(row)
            z.append(user)
            u = dict(zip(name, z))
            final.append(u)

        # final.append({'nowuser':user})

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
        update grade 
        set grade=%s
        where sno=%s and cno=%s
        '''
        with self.db_cursor() as cur:
            data=[grade['grade'],sno,cno]
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