/*
 *   @params{*} success 数据库连接成功的回调
 *   @params{*} error 数据库连接失败的回调
*/

module.exports = function(success,error){
    //判断error为其设置默认值
    if(typeof error !== 'function'){
        error= ()=>{
            console.log('连接失败！');
        }
    }

//1.安装mongoose
//2.导入mongoose
const mongoose = require('mongoose');
//导入配置文件
const {DBHOST,DBPORT,DBNAME} = require('../config/config.js');

//3.连接mongodb服务  (协议名称mongodb,ip地址127.0.0.1,端口号(默认)27017,数据库名称bilibili(如果数据库不存在会自动创建))
mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`);

//设置 strictQuery 为 true
mongoose.set('strictQuery', true);

//4.设置回调
//设置连接成功的回调 -> once只执行一次
mongoose.connection.once('open',()=>{
    success();
});

//连接失败的回调
mongoose.connection.on('error',()=>{
    error();
});
//设置连接关闭的回调
mongoose.connection.on('close',()=>{
    console.log('连接关闭!');
});
}