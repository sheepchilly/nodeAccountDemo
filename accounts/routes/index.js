var express = require('express');
var router = express.Router();
//导入lowdb
const low =require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync(__dirname + '/../data/db.json');
//获取db对象
const db = low(adapter);
//导入shortid(用来生成数据库中的唯一id)
const shortid = require('shortid');

//记账本的列表
router.get('/account', function(req, res, next) {
  //获取所有的账单信息
  let accounts  = db.get('accounts').value();
  res.render('list',{accounts:accounts});
});

//添加记录
router.get('/account/create', function(req, res, next) {
  res.render('create')
});

//新增记录
router.post('/account',(req,res)=>{
  //生成id
  let id = shortid.generate();
  //获取请求体的数据
  // console.log(req.body);
  //写入文件 (将id和请求体写成对象+展开运算符,传递给数据库)
  db.get('accounts').unshift({id,...req.body}).write();
  //成功提醒
  res.render('success',{msg:'添加成功哦~~',url:'/account'});
})

//删除记录
router.get('/account/:id',(req,res)=>{
  //获取params的id参数
  let id = req.params.id;
  //根据id删除对象
  db.get('accounts').remove({id}).write();
  //提醒
  res.render('fail',{msg:'删除成功~(￣▽￣)~*',url:'/account'});
})

module.exports = router;
