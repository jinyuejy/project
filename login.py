import web
import dbconn
import os
bsae_dir=os.path.dirname(__file__)
class login(web.BaseHandler):
    def post(self,path):
        name=self.get_argument('name')  #学号sno
        password=self.get_argument('password')
        role=self.get_argument('role')
        register=dbconn.get_register()
        admin={}
        student={}
        for i in register.keys():
            if i in['1710650105','1710650122','1710650104','1710650227']:
                admin[i]=register[i]
            else:
                student[i]=register[i]

        if role=='admins':
            if name in admin.keys():
                if password==admin[name][1]:
                    self.set_secure_cookie('user',name)
                    self.redirect('/')
                else:
                    self.redirect('/login')
            else:
                self.redirect('/login')
                print('没有注册管理员')

        else:
            if name in student.keys():
                if password==student[name][1]:
                    self.set_secure_cookie('user',name)
                    self.redirect('/stu')
                else:
                    self.redirect('/login')
            else:
                self.redirect('/login')
                print('没有注册')

