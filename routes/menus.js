const RouterHandle = require('../libs/router-handler');
const router = new RouterHandle()
const connection = require('../libs/mysql-connection')
const arrayHandle = require('../utils/array')
const TABLE_NAME = 'menus'
//SQL语句
const sql = `SELECT * FROM ${TABLE_NAME}`;
const addSql = `INSERT INTO ${TABLE_NAME}(title,name,path,icon,isDisplay,urlOrder,pId) VALUES(?,?,?,?,?,?,?)`;
const deleteSql = `DELETE FROM ${TABLE_NAME} WHERE menuId=?`;

const connect = (sql) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      err && reject(err)
      resolve(result)
    })
  })
}

//增
router.$post('/add', function ({ body }, res, next) {
  const { title, name, path, icon, isDisplay, urlOrder, pId = null } = body.payload
  connection.query(addSql, [title, name, path, icon, isDisplay, urlOrder, pId], function (err, result) {
    err && res.$err(err)
    res.status(200).$success([])
  });
})
//删
router.$post('/delete/:menuId', function ({ params }, res, next) {
  connection.query(deleteSql, [params.menuId], function (err, result) {
    err && res.$err(err)
    res.status(200).$success('删除成功')
  });
})
//改
router.$post('/update/:menuId', function ({ body, params }, res, next) {
  const { name, path } = body.payload
  if (!name && !path) {
    res.$err('参数错误')
    return
  }
  let updateSql = `UPDATE ${TABLE_NAME} SET `;
  const updateData = []
  if (name) {
    updateSql += 'name=?,'
    updateData.push(name)
  }
  if (path) {
    updateSql += 'path=?,'
    updateData.push(path)
  }
  updateSql=updateSql.substr(0, updateSql.length-1)
  updateData.push(params.menuId)
  updateSql += ' WHERE menuId=?'
  connection.query(updateSql, updateData, function (err, result) {
    err && res.$err(err)
    res.status(200).$success('修改成功')
  });
})
// 查
router.$post('/list', function ({ body }, res, next) {
  const { menuId, isDisplay } = body.payload || {}
  if (!menuId && !isDisplay) {
    connect(sql).then(result => {
      res.status(200).$success(arrayHandle.parseToTree(result))
    }).catch(err => {
      res.$err(err)
    })
  } else {
    let targetSql = sql + ` WHERE`
    if (menuId) {
      targetSql += ` (menuId=${menuId} or pId=${menuId})`
    }
    if (isDisplay) {
      targetSql += ` and isDisplay="${isDisplay}"`
    }
    // 三层目录
    connect(targetSql).then(async result => {
      if (result.length > 1) {
        Promise.all(result.filter(item => item.menuId !== menuId).map(item => connect(sql + ` WHERE pId=${item.menuId}`))).then(children => {
          res.status(200).$success(arrayHandle.parseToTree(children.reduce((pre, curr) => pre.concat(curr), result)))
        }).catch(err => {
          res.$err(err)
        })
      } else {
        res.status(200).$success(arrayHandle.parseToTree(result))
      }
    }).catch(err => {
      res.$err(err)
    })
  }
});

module.exports = router.router;
