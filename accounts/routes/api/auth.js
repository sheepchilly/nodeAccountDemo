var express = require('express');
var router = express.Router();

const userModle = require('../../modules/UserModel');
//引入md5
const md5 = require('md5');
const UserModule = require('../../modules/UserModel');

//导入jwt
const jwt = require('jsonwebtoken');


//登录操作
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

//退出登录
router.post('/logout',(req,res)=>{
    //销毁session
    req.session.destroy(()=>{
        res.render('success',{msg:'退出成功',url:"/login"});
    })
})

module.exports = router;
