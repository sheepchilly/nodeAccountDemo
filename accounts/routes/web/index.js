var express = require('express');
var router = express.Router();

//导入生成日期的包
const moment = require('moment');
//导入模块
const AccountModule = require('../../modules/AccountModule')


//记账本的列表
router.get('/account',async function(req, res, next) {
  //读取集合信息
  try{
    const data = await AccountModule.find().sort({time:-1}).exec()
    res.render('list',{accounts:data,moment:moment}) 
  }catch(err){
    res.status(500).send('读取失败~~');
    return;
  }
});

//添加记录
router.get('/account/create', function(req, res, next) {
  res.render('create')
});

//新增记录
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

//删除记录
router.get('/account/:id',(req,res)=>{
  //获取params的id参数
  let id = req.params.id;
  //删除
  AccountModule.deleteOne({_id:id}).then(data=>{
    //提醒
    res.render('fail',{msg:'删除成功~(￣▽￣)~*',url:'/account'});
  }).catch(err=>{
    res.status(500).send('删除失败~~');
    return;
  })

  
})

module.exports = router;
