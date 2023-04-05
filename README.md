# 1.搭建骨架

express  -e accounts （accounts是文件夹的名称）

# 2.安装依赖

1.在accounts文件夹下 -> npm i

2.修改package.json中的start为nodemon -> 因为node不能自动重启，nodemon可以自动重启

# 3.编写路由规则

1.在routes的index.js文件夹中 添加记账本的列表路由'/account'和添加记录'/account/create'

# 4.创建页面模板

1.在views文件夹下新建list.ejs和create.ejs

2.相对路径会受到当前网页URL路径的影响，路径变它就会变。改成绝对路径会跟当前网页的路径进行拼接，也就是说页面路径随便变，请求始种是指向服务器的某一个资源的