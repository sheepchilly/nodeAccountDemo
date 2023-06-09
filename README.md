# 1.版本一

## 1.搭建骨架

express  -e accounts （accounts是文件夹的名称）

## 2.安装依赖

1.在accounts文件夹下 -> npm i

2.修改package.json中的start为nodemon -> 因为node不能自动重启，nodemon可以自动重启 -> 用npm start运行

## 3.编写路由规则

1.在routes的index.js文件夹中 添加记账本的列表路由'/account'和添加记录'/account/create'

## 4.创建页面模板

1.在views文件夹下新建list.ejs和create.ejs

2.相对路径会受到当前网页URL路径的影响，路径变它就会变。改成绝对路径会跟当前网页的路径进行拼接，也就是说页面路径随便变，请求始种是指向服务器的某一个资源的

## 5.获取表单数据

1.给每一个input和select和textarea加上name

2.form加上method和action -> action可以只写/account，因为会自动拼接

3.新增一条路由规则用于收集表单数据

```js
router.post('/account',(req,res)=>{
  //获取请求体的数据
  console.log(req.body); //因为app.js中已经实现了请求体的封装，所以这里可以直接req.body
  res.send('添加记录');
})
```

## 6.本案例使用lowdb数据库

1.安装npm i lowdb@1.0.0 => 基本使用的代码在test文件夹下（增删改查）

2.新建data文件夹，在其中新建db.json并完成初始化accounts数据，并在路由中导入lowdb数据库

```js
//导入lowdb
const low =require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync(__dirname + '/../data/db.json');
//获取db对象
const db = low(adapter);
```

3.在/account路由中把请求体中的数据写入数据库

```js
db.get('accounts').push(req.body).write();
```

4.本案例用的是shortid来生成数据id，需要安装 => npm i shortid

```js
//导入shortid
const shortid = require('shortid');
//在路由里生成shortid
let id = shortid.generate();
```

5.将id和请求体一起上传到数据库中，用 **对象+展开运算符** 将数据unshift到开头

```js
db.get('accounts').unshift({id,...req.body}).write();
```

6.写入成功后跳转页面，并使用ejs显示页面信息和跳转

```js
res.render('success',{msg:'添加成功哦~~',url:'/account'});

//在success.ejs中用ejs的模板来插入对象中数据
<h1>:) <%= msg %></h1>
<p><a href="<%= url %>">点击跳转</a></p>
```

## 7.帐单列表页面

**思路：**从数据库当中取出数据在网页当中呈现

1.如何取出数据？

```js
let accounts  = db.get('accounts').value();
```

2.如何传递数据给ejs来渲染列表？ => 用render的第二个参数传递

```js
res.render('list',{accounts});
```

3.如何渲染列表？ -> 用ejs的模板语法

```js
<% accounts.forEach(item=>{ %>
<% }) %>
```

4.然后在数据中用 <%= item.xxx %>就可以展示出数据了

5.收入还是支出根据数据里面的**type的数字+三目运算符**来判断展示的是收入还是支出

## 8.删除账单

**思路：**点击账单后面的x号时可以把账单删除掉

1.创建新的路由规则删除记录

2.传参可以选择query也可以选择params传

3.在node中怎么样删除？ => 在button按钮外面包裹一层a标签，href设置成路径，把当前id传过去就可以删除

```js
<a href="/account/<%= item.id %>">
    <div class="one-fox">
        <button class="btn">删除</button>
    </div>
</a>
```

4.在删除记录的路由中根据id删除对象

```js
db.get('accounts').remove({id}).write();
```

5.用render向ejs传递数据，并用ejs模板展示数据

```js
res.render('fail',{msg:'删除成功~(￣▽￣)~*',url:'/account'});
//fail.ejs
<h1><%= msg %></h1>
<p><a href="<%= url%>">点击跳转</p>
```





# 2.版本二：使用mongoDB数据库

## 1.导入db函数

1.因为入口文件在www下面，所以导入也在bin-www下，db成功的回调包含整个文件

2.db函数是干什么用的？ 用来连接mongoDB数据库的封装组件，数据库连接成功之后再使用http服务

3.在modules下新建AccountModule，然后新建文档的对象结构，在里面协商db.json需要的字段名称

## 2.将时间字符转成日期对象？

1.借助一个工具包，把时间转成时间对象 2023-04-07 -> Object ->new Data()

2.安装moment => npm i moment

3.用moment的toData()方法转成日期对象 => moment('2023-02-24').toDate();

## 3.新增记录

```js
router.post('/account',(req,res)=>{
  //插入数据库
  AccountModule.create({
    //扩展运算符展开req.body里面的内容，但是里面的time不是我们想要的，所以在下面修改time
    ...req.body,
    //修改time属性的值
    time:moment(req.body.time).toDate()
  }).then(data=>{
        res.render('success',{msg:'添加成功哦~~',url:'/account'});
  }).catch(err=>{
    res.status(500).send('插入失败~~');
      return;
  })
})
```

## 4.读取数据库

1.render中的第二个参数 {ejs模板中的变量:值}

2.这里数据库里存的值是Number类型，所以在list.ejs模板中，三元运算符判断数据类型就不需要加双引号了

3.日期转成想要的格式 => moment(new Date()).format('YYYY-MM-DD')

## 5.删除文档

1.注意：数据库里的id是_id，所以要把ejs模板中的id改变

2.别忘了，删除是用a标签包裹删除按钮，然后在a标签的href里用ejs模板传入获取要删除的路由的id

3.防止用户误操作，可以给按钮绑定事件，用原生js，遍历伪数组中的按钮，然后弹出一个确认框，如果用户点击确定就删除，否则阻止默认行为e.preventDefault()

```js
<a href="/account/<%= item._id>" class="delBtn">
<script>
    let delBtns=document.querySelectorAll('.delBtn');
    //绑定事件
    delBtns.forEach(item=>{
        item.addEventListener('click',function(e){
            if(confirm('您确定要删除吗？')){
                return true;
            }else{
                //阻止默认行为
                e.preventDefault();
            }
        })
    })
</script>
```

# 3.版本三：添加接口功能

用json给客户端传递数据，也就是说返回的不再是ejs的HTML解构，而是json结构

## 1.修改记账本列表的获取

- 在成功的回调里面改为json格式，json体里面有三个数据

```js
res.json({
      //响应的编号
      code:'0000',
      //响应的信息
      msg:'读取成功',
      //响应的数据
      data
    })
```

- 在失败的回调里同样返回json格式

```js
res.json({
      code:'1001',
      msg:'读取失败',
      data:null
    })
```

## 2.添加记录

**注意：**json的接口服务不会再添加记录，所以可以删除掉添加记录

## 3.新增记录

在新增记录（post提交的路由规则里）里修改成功和失败的json格式（同上）

## 4.删除记录

- 把post改为delete
- 成功和失败的结果里改为res.json

## 5.获取单条记录

1.新增一个get方法向/account/:id接口发送请求

2.用mongoose的findById()方法根据id查询记录，在成功和失败的返回里面用json格式

```js
AccountModule.findById(id).then()
```

## 6.更新账单

1.新增一个patch方法通过接口向服务器发请求

2.用mongoose的updateOne()方法更新数据，updateOne接收两个参数(id,body)，在成功和失败的回调里面用json给客户端返回数据

```js
router.patch('/account/:id',(req,res)=>{
  let id = req.params.id;
  AccountModule.updateOne({_id:id},req.body).then(data=>{})
```

# 4.版本4：session

1.在routes->web->auth.js中增加路由规则

2.用render引入HTML模板引擎

3.因为没有用过reg的路由，所以需要在app.js中引入

## 1.新增注册页面

**目的：**根据不同用户设置不同的权限

1.form表单验证，用post方法提交到/reg，所以要再创建一条路由规则

2.新建数据模型用于存储表单数据，并在路由规则里引入数据模型

3.往数据库中添加用户输入的账号和密码，并且对密码加密 => 用md5加密 npm i md5

```js
router.post('/reg',(req,res)=>{
    //1.做表单验证
    //2.获取请求体的数据
    userModle.create({...req.body,password:md5(req.body.password)}).then(data=>{
        res.render('success',{msg:'注册成功',url:'/login'})

    }).catch(err=>{
        res.status(500).send('注册失败，请稍后再试~');
        return;
    })
})
```



## 2.用户登录

1.新建登录的页面和路由规则

2.用户登陆后向数据库查询对应的username和password，返回的结果有两种 => 1.用户输对了账号和密码 2.用户输错误的账号和密码，所以要进行判断

```js
router.post('/login',(req,res)=>{
    //获取用户名和密码
    let {username,password} = req.body;
    //查询数据库
    UserModule.findOne({username:username,password:md5(password)}).then(data=>{
        if(!data){
           return res.send('账号或密码错误');
        }
        res.render('success',{msg:'登录成功',url:'/account'})
    }).catch(err=>{
        res.status(500).send('登陆失败~~');
        return;
    })
})
```

## 3.写入session

**思路：**用户登录成功之后再去写入session

1.安装 => npm i express-session connect-mongo  ，在app.js中导入express-session和connect-mongo =>const session = require('express-session'); => const MongoStorage = require('connect-mongo');

2.在app.js下配置session中间件

3.在auth.js的router.post('/login')的成功结果中写入session

```js
router.post('/login',(req,res)=>{
    //获取用户名和密码
    let {username,password} = req.body;
    //查询数据库
    UserModule.findOne({username:username,password:md5(password)}).then(data=>{
        if(!data){
           return res.send('账号或密码错误');
        }
        //写入session
        req.session.username = data.username;
        req.session._id = data._id; //用户文档里面的id
        res.render('success',{msg:'登录成功',url:'/account'})
    }).catch(err=>{
        res.status(500).send('登陆失败~~');
        return;
    })
})
```

## 4.用户登录检测

1.当用户在地址栏输入目标url的时候，判断用户是否携带着session，如果没有就跳转至登录页=>redirect('/login')，如果携带就放行

2.因为有很多个路由都要使用这个路由判断，所以可以把他封装成一个中间件，在需要使用的路由规则中间使用（把中间件放在一个单独的文件夹下）

```js
//声明中间件检测登录
module.exports = (req,res,next)=>{
    if(!req.session.username){
      return res.redirect('/login');
    }else{
      next();
    }
  }
//使用：
const checkLoginMiddleware = require('../../middlewares/checkLoginMiddleWare');
router.get('/account',checkLoginMiddleware,async function(req, res, next) {}
```

## 5.退出登录

**思路**：用户一点击退出后就销毁session，然后跳转至登陆页

1.在auth.js中增加一条路由规则，使用req.session.destroy()方法销毁session，然后用render跳转到success页面

```js
//退出登录
router.post('/logout',(req,res)=>{
    //销毁session
    req.session.destroy(()=>{
        res.render('success',{msg:'退出成功',url:"/login"});
    })
})
```

## 6.首页和404页面

1.首页直接重定向到/account页面

```js
router.get('/',(req,res)=>{
  //重定向到账本列表页
  res.redirect('/account')
})
```

2.在app.js中响应404的模板

```js
app.use(function(req, res, next) {
  //响应404的模板
  res.render('404');
});
```

## 7.token和JWT

1.什么是token？

> token 是服务端生成并返回给HTTP客户端的一串加密字符串，token中保存着用户信息

2.什么是jwt？

> JWT JSON Web Token是目前最流行的跨域认证解决方案，可用于基于token的身份验证

## 8.接口端约束

**思路：**因为不管客户端发来的请求是什么样的，服务器都会返回数据，这样是不行的！所以我们要对它做一个约束

1.在api文件夹下面新建auth.js

2.接口端只需要做登录操作，在登录接口里面添加token

- 引入jwt => npm i jsonwebtoken => const jwt = requrie('jsonwebtoken');
- 要app.js里面注册/api/auth

```js
const authApiRouter = require('./routes/api/auth')
app.use('/api',addApiRouter);
```

3.根据用户输入的用户名和密码查询数据库，然后生成jwt并返回=>用res.json返回

```js
router.post('/login',(req,res)=>{
    //获取用户名和密码
    let {username,password} = req.body;
    //查询数据库
    UserModule.findOne({username:username,password:md5(password)}).then(data=>{
        if(!data){
           return res.json({
            code:'2001',
            msg:'用户名或密码错误~~',
            data:null
           })
        }
        //写入jwt
        let token = jwt.sign({
            username:data.username,
            _id:data._id
        },'123123',{
            expiresIn:60*60*24*7
        })

        res.json({
            code:'0000',
            msg:'登录成功！',
            data:token //注意这里返回的是token
        })
    }).catch(err=>{
            res.json({
             code:'2001',
             msg:'登录失败~~',
             data:null
            })
        return;
    })
})
```

## 9.校验token

1.在auth.js的account.js中校验

2.首先引入jsonwebtoken => const jwt = require('jsonwebtoken');

3.客户端把token发来，token放在什么位置呢？**答：**服务端告诉客户端token在哪里传递，token就在哪里（但是一般放在请求头当中）

4.设置中间件，用来判断是否携带token
