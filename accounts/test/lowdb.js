//1.导入lowdb
const low =require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
//2.获取db对象
const db = low(adapter);

//3.初始化数据
db.defaults({posts:[],user:{}}).write()

//4.写入数据
db.get('posts').unshift({id:0,title:'今天天气不错~'}).write();
db.get('posts').push({id:2,title:'今天天气不错~'}).write();
db.get('posts').push({id:3,title:'今天天气不错~'}).write();


//5.获取数据
console.log(db.get('posts').value());

//6.删除数据
db.get('posts').remove({id:3}).write();

//7.获取单条数据
let res = db.get('posts').find({id:1}).value();
console.log(res);

//8.更新数据
db.get('posts').find({id:1}).assign({title:'今天下雨啦~!'}).write();
