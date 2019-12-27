# -*- coding: utf-8 -*-

import json
import datetime
import tornado.web
import tornado.ioloop
import dbconn
import os

bsae_dir=os.path.dirname(__file__)
class BaseHandler(tornado.web.RequestHandler):
    def db_cursor(self, autocommit=True):
        return dbconn.SimpleDataCursor(autocommit=autocommit)
    def get_user(self):
        user=self.get_secure_cookie('user')
        if user:
            user=user.decode('utf-8')
            user=tornado.escape.xhtml_escape(user)
        else:
            print('您应该先登录')

        return user

class HtplHandler(BaseHandler):
    def get(self, path):
        user=self.get_user()
        print('姓名：',user)
        if not path: 
            path = 'default'

        # bsae_dir=os.path.dirname(__file__)
        if path=='logout':
            self.clear_cookie('user')
            print("clear suscessfully")
            path='login'
        page = os.path.join(bsae_dir, 'pages', path +'.html')
        # if path=='default':
        #     name=user
        # else:
        #     name=user
        try:
            if not user and path !='login':
                self.redirect('/login')
            else:
                
                self.set_header("Content-Type", "text/html; charset=UTF-8")
                self.render(page)
        except IOError as e:
            if not os.path.exists(page): 
                raise tornado.web.HTTPError(404)
            raise e
    


class RestHandler(BaseHandler):
    def read_json(self):
        json_obj = json.loads(self.request.body)
        return json_obj

    def write_json(self, data):
        json_str = json.dumps(data, cls=JsonDataEncoder)
        self.set_header('Content-type', 'application/json; charset=UTF-8')
        self.write(json_str)  



class JsonDataEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (datetime.date, datetime.datetime)):
            return obj.isoformat()
        elif isinstance(obj, (decimal.Decimal)) :
            return float(obj)
        else:
            return json.JSONEncoder.default(self, obj)
        


