import web
import dbconn
import os
bsae_dir=os.path.dirname(__file__)
class login(web.BaseHandler):
    # def get(self,path):
    #     page = os.path.join(bsae_dir, 'pages', path +'.html')
    #     self.render(page)
    def get_register(self):
        # dsn='host=localhost dbname=examdb user=examdbo password=pass'
        # pool=dbconn.psycopg2.pool.ThreadedConnectionPool(1,20,dsn)
        dbconn.register_dsn()
        pool=dbconn._get_connection_pool()
        conn=pool.getconn()
        cur=conn.cursor()

        sql='''
        select sname,password
        from student
        '''
        try:
            cur.execute(sql)
            conn.commit()
            pool.putconn(conn)

        except:
            conn.rollback()
            raise

        name=cur.fetchall()
        return dict(name)
        

    def post(self,path):
        name=self.get_argument('name')
        password=self.get_argument('password')
        register=self.get_register()
        if name in register.keys():
            if password==register[name]:
                self.set_secure_cookie('user',name)
                self.redirect('/')
            else:
                self.redirect('/login')
                return
        else:
            self.redirect('/login')
            print('无此用户，请注册')
        
# class logout(web.BaseHandler):
#     def get(self,path):
#        page = os.path.join(bsae_dir, 'pages', 'login' +'.html')
#        self.clear_cookie('user')
#        self.render(page)
#        print('clear suscessfully')