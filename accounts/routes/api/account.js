//与账单相关的接口
const express = require('express');
const router = express.Router();

//导入生成日期的包
const moment = require('moment');
//导入模块
const AccountModule = require('../../modules/AccountModule')
//导入中间件
const checkTokenMidleware = require('../../middlewares/checkTokenMidleware')



//记账本的列表
router.get('/account',checkTokenMidleware,async function (req, res, next) {
  
    //如果token正确，读取集合信息
    try {
      const data = await AccountModule.find().sort({ time: -1 }).exec()
      // res.render('list',{accounts:data,moment:moment}) 
      // 响应成功的提示
      res.json({
        //响应的编号
        code: '0000',
        //响应的信息
        msg: '读取成功',
        //响应的数据
        data
      })
    } catch (err) {
      // res.status(500).send('读取失败~~');
      res.json({
        code: '1001',
        msg: '读取失败',
        data: null
      })
      return;
    }
});


//新增记录
router.post('/account',checkTokenMidleware, (req, res) => {
  //插入数据库
  AccountModule.create({
    //扩展运算符展开req.body里面的内容，但是里面的time不是我们想要的，所以在下面修改time
    ...req.body,
    //修改time属性的值
    time: moment(req.body.time).toDate()
  }).then(data => {
    // res.render('success',{msg:'添加成功哦~~',url:'/account'});
    res.json({
      code: '0000',
      msg: '添加成功！',
      data
    })
  }).catch(err => {
    // res.status(500).send('插入失败~~');
    res.json({
      code: '1001',
      msg: '添加失败~~',
      data: null
    })
    return;
  })
})

//删除记录
router.delete('/account/:id',checkTokenMidleware, (req, res) => {
  //获取params的id参数
  let id = req.params.id;
  //删除
  AccountModule.deleteOne({ _id: id }).then(data => {
    //提醒
    // res.render('fail',{msg:'删除成功~(￣▽￣)~*',url:'/account'});
    res.json({
      code: '0000',
      msg: '删除成功！',
      data
    })
  }).catch(err => {
    // res.status(500).send('删除失败~~');
    res.json({
      code: '1003',
      msg: '删除失败',
      data: null
    })
    return;
  })


})

//获取单个账单信息
router.get('/account/:id',checkTokenMidleware, (req, res) => {
  let id = req.params.id;
  AccountModule.findById(id).then(data => {
    res.json({
      code: '0000',
      msg: '查询成功！',
      data
    })
  }).catch(err => {
    res.json({
      code: '1004',
      msg: '查询失败',
      data: null
    })
  })
})


//更新账单
router.patch('/account/:id',checkTokenMidleware, (req, res) => {
  let id = req.params.id;
  AccountModule.updateOne({ _id: id }, req.body).then(data => {
    res.json({
      code: '0000',
      msg: '更新成功！',
      data
    })
  }).catch(err => {
    res.json({
      code: '1005',
      msg: '更新失败',
      data: null
    })
  })
})

module.exports = router;
