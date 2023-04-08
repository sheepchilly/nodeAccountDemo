//导入mongoose
const mongoose = require('mongoose');

//5.创建文档的结构对象
let UserSchema = new mongoose.Schema({
    username:String,
    password:String
});

//6.创建模型对象 -> 对文档操作的封装对象,可以实现对文档的增删改查
let UserModule = mongoose.model('users', UserSchema);


//暴露模型对象
module.exports = UserModule;