# -*- coding: utf-8 -*-

import web
import datetime
import tornado.web
import tornado.ioloop
class StudentRestHandler(web.RestHandler):
    def get(self, sno):
        sql = '''
        SELECT sno, sname, ssex, rd 
        FROM student
        '''
        with self.db_cursor() as dc:
            if sno :
                sql += " WHERE sno=%s"
                dc.execute(sql, [sno])
                self.write_json(dc.fetchall_dicts())
            else:
                sql += 'ORDER BY rd, sno'
                dc.execute(sql)
                self.write_json(dc.fetchall_dicts())

    def post(self, sno):
        stu = self.read_json()
        
        if not stu.get('rd'):
            stu['rd'] = datetime.date(1900, 1, 1)

        with self.db_cursor() as dc:
            sql = '''
            INSERT 
            INTO student(sno,sname,ssex,PASSWORD,rd)
            VALUES(%s, %s, %s, %s,%s);
            '''
            dc.execute(sql, [stu.get('sno'),stu.get('sname'),stu.get('ssex'),stu.get('PASSWORD'),stu.get('rd')])
            # sn = dc.fetchone()[0]
            # stu['sno']=sn
            self.write_json(stu)

    def put(self, sno):
        stu = self.read_json()

        if not stu.get('rd'):
            stu['rd'] = datetime.date(1900, 1, 1)

        with self.db_cursor() as dc:
            sql = ''' 
            UPDATE student SET 
            sno=%s,sname=%s, ssex=%s,PASSWORD=%s, rd=%s
            WHERE sno=%s;
            '''
            dc.execute(sql, [stu['sno'],stu['sname'], 
                stu['ssex'], stu['PASSWORD'],stu['rd'],sno])
            dc.commit()

        self.write_json(stu)

    def delete(self, sno):
        # sn = int(sn)
        with self.db_cursor() as cur:
            sql = '''DELETE 
            FROM student 
            WHERE sno= %s'''
            cur.execute(sql, [sno])



    


    
