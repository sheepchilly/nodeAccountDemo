var express = require('express');
var router = express.Router();

const userModle = require('../../modules/UserModel');
//引入md5
const md5 = require('md5');
const UserModule = require('../../modules/UserModel');

//注册
router.get('/reg',(req,res)=>{
    //响应HTML
    res.render('auth/reg')
})
//表单往这里提交
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

//登录
router.get('/login',(req,res)=>{
    //响应HTML
    res.render('auth/login')
})
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

//退出登录
router.post('/logout',(req,res)=>{
    //销毁session
    req.session.destroy(()=>{
        res.render('success',{msg:'退出成功',url:"/login"});
    })
})

module.exports = router;
