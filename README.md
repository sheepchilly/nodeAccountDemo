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

# 5.获取表单数据

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

# 6.本案例使用lowdb数据库

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

# 7.帐单列表页面

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

# 8.删除账单

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

