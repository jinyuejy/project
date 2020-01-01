import psycopg2.pool as py
import pandas as pd
def submit(dsn,sql,File,index=0,position=10000):
    work=pd.read_excel(File,index)
    c=list(work.columns)
    pool=py.ThreadedConnectionPool(1,20,dsn=dsn)
    try:
        conn=pool.getconn()
        with conn.cursor() as cur:
            for i in range(len(work)):
                sorc=work.loc[i]
                data=[]
                for j in range(len(c)):
                    if position==j:
                        data.append(float(sorc[c[j]]))
                    else:
                        data.append(str(sorc[c[j]]))
                cur.execute(sql,data)
        conn.commit()
        print('录入成功')
    except:
        conn.rollback()
        print('请修改错误后重新输入')
        raise