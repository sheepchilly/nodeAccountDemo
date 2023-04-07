//导入mongoose
const mongoose = require('mongoose');

//5.创建文档的结构对象
let BookSchema = new mongoose.Schema({
    name: String,
    author: String,
    price: Number
});

//6.创建模型对象 -> 对文档操作的封装对象,可以实现对文档的增删改查
let BookModel = mongoose.model('book', BookSchema);


//暴露模型对象
module.exports = BookModel;