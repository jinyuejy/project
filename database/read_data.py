# import pandas as pd
# import numpy as  np
import re
# data=pd.read_excel('x1.xls')

# head=data.loc[:,['姓名','总分']]

# dd=data.columns
# print(len(dd))
# for item in dd:
#     print(item,' ',end='')
# print()

# for i in range(10):
#     for j in range(len(dd)):

#         uu=data.iloc[i,j]
#         print(uu,'  ',end='')

#     print(' ')



str='sjlakjsj47852'

u=re.match(r'.*',str)
print(u)