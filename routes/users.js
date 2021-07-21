const RouterHandle = require('../libs/router-handler');
const router = new RouterHandle()
const connection = require('../libs/mysql-connection')
const TABLE_NAME = 'menus'
//SQL语句
const sql = `SELECT * FROM ${TABLE_NAME}`;
const addSql = `INSERT INTO ${TABLE_NAME}(name,gender,age) VALUES(?,?,?)`;
const deleteSql = `DELETE FROM ${TABLE_NAME} WHERE id=?`;
const updateSql = `UPDATE ${TABLE_NAME} SET name=?,age=? WHERE id=?`;

//增
router.$post('/add', function ({ body }, res, next) {
  const { name, gender, age } = body.payload
  connection.query(addSql, [name, gender, age], function (err, result) {
    err && res.$err(err)
    res.status(200).$success([])
  });
})
//删
router.$post('/delete/:id', function ({ params }, res, next) {
  connection.query(deleteSql, [params.id], function (err, result) {
    err && res.$err(err)
    res.status(200).$success('删除成功')
  });
})
//改
router.$post('/update/:id', function ({ body, params }, res, next) {
  const { name, gender, age } = body.payload
  connection.query(updateSql, [name, age, params.id], function (err, result) {
    err && res.$err(err)
    res.status(200).$success('修改成功')
  });
})
// 查
router.$post('/list', function ({ body }, res, next) {
  const { id, name, gender, age } = body.payload || {}
  const callback = (err, result) => {
    err && res.$err(err)
    res.status(200).$success(result)
  }
  if (!id && !name && !gender && !age) {
    connection.query(sql, callback);
  } else {
    let targetSql = sql + ` WHERE`
    const targetVal = []
    if (id) {
      targetSql += ' id=?'
      targetVal.push(id)
    }
    if (name) {
      targetSql += ' name=?'
      targetVal.push(name)
    }
    if (gender) {
      targetSql += ' gender=?'
      targetVal.push(gender)
    }
    if (age) {
      targetSql += ' age=?'
      targetVal.push(age)
    }
    connection.query(targetSql, targetVal, callback);
  }
});

module.exports = router.router;
