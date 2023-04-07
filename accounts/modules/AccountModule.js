//导入mongoose
const mongoose = require('mongoose');

//5.创建文档的结构对象
let AccountSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    time:Date,
    type:{
        type:Number,
        default:-1
    },
    account:{
        type:Number,
        required:true
    },
    remarks:String
});

//6.创建模型对象 -> 对文档操作的封装对象,可以实现对文档的增删改查
let AccountModule = mongoose.model('accounts', AccountSchema);


//暴露模型对象
module.exports = AccountModule;