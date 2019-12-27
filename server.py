# -*- coding: utf-8 -*-

import tornado.ioloop
import tornado.web
import asyncio,time
asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
import os,login
import web
import dbconn
import course
dbconn.register_dsn()

from handlers import *

bsae_dir=os.path.dirname(__file__)

settings = {
    "static_path": os.path.join(bsae_dir, 'pages'),
    "debug": True
}



application = tornado.web.Application([
    (r'/user/(login)',login.login),
    (r"/s/student/(.*)", StudentRestHandler),
    (r'/s/course/(.*)',course.course),
    (r'/(.*)', web.HtplHandler)
], **settings,
cookie_secret='__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__')


if __name__ == "__main__":
    application.listen(8888)
    server = tornado.ioloop.IOLoop.instance()
    tornado.ioloop.PeriodicCallback(lambda: None, 500).start()
    server.start()

