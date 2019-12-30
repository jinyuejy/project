import web
import dbconn
import os
bsae_dir=os.path.dirname(__file__)
class login(web.BaseHandler):
    # def get_register(self):
    #     dbconn.register_dsn()
    #     pool=dbconn._get_connection_pool()
    #     conn=pool.getconn()
    #     cur=conn.cursor()

    #     sql='''
    #     select sno,sname,password
    #     from student
    #     '''
    #     try:
    #         cur.execute(sql)
    #         result=cur.fetchall()
    #         conn.commit()
    #         pool.putconn(conn)

    #     except:
    #         conn.rollback()
    #         raise

    #     ssno=[]
    #     sinfor=[]
    #     for row in result:
    #         ssno.append(row[0])
    #         sinfor.append([row[1],row[2]])

    #     return dict(zip(ssno,sinfor))
        

    def post(self,path):
        name=self.get_argument('name')  #学号sno
        password=self.get_argument('password')
        role=self.get_argument('role')
        register=dbconn.get_register()
        if name in register.keys():
            if password==register[name][1]:
                self.set_secure_cookie('user',name)
                if role=="admins":
                    self.redirect('/')
                else:
                    self.redirect('/stu')
            else:
                self.redirect('/login')
                return
        else:
            self.redirect('/login')
            print('无此用户，请注册')


