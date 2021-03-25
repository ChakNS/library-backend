//加载mysql模块
const mysql = require('mysql');
//创建连接
const DATA_BASE = 'test_data'
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'zzk156227',
  database: DATA_BASE
});
//执行创建连接 
connection.connect();

module.exports = connection;