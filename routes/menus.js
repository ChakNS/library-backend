const RouterHandle = require('../utils/router-handler');
const router = new RouterHandle()
const mysql = require('../api/mysql')
const arrayHandle = require('../utils/array')
//SQL语句
const TABLE_NAME = 'menus'
const sql = `SELECT * FROM ${TABLE_NAME}`;
const addSql = `INSERT INTO ${TABLE_NAME}(title,name,path,icon,isDisplay,urlOrder,pId) VALUES(%VALUES%)`;
const deleteSql = `DELETE FROM ${TABLE_NAME} WHERE menuId=`;

//增
router.$post('/add', function ({ body }, res, next) {
  const { title, name, path, icon, isDisplay, urlOrder, pId = null } = body.payload
  mysql(addSql.replace('%VALUES%', `"${title}", "${name}", "${path}", "${icon}", "${isDisplay}", ${urlOrder}, ${pId}`)).then(result => {
    res.status(200).$success('创建成功')
  }).catch(err => {
    console.log(err)
    res.$err(err)
  })
})
//删
router.$post('/delete/:menuId', function ({ params }, res, next) {
  mysql(deleteSql + params.menuId).then(result => {
    res.status(200).$success('删除成功')
  }).catch(err => {
    console.log(err)
    res.$err(err)
  })
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
    updateSql += `name="${name}",`
  }
  if (path) {
    updateSql += `path="${path}",`
  }
  updateSql=updateSql.substr(0, updateSql.length-1)
  updateSql += ` WHERE menuId=${menuId}`
  mysql(updateSql).then(result => {
    res.status(200).$success('修改成功')
  }).catch(err => {
    res.$err(err)
    console.log(err)
  })
})
// 查
router.$post('/list', function ({ body }, res, next) {
  const { menuId, isDisplay } = body.payload || {}
  if (!menuId && !isDisplay) {
    mysql(sql).then(result => {
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
    mysql(targetSql).then(async result => {
      if (result.length > 1) {
        Promise.all(result.filter(item => item.menuId !== menuId).map(item => mysql(sql + ` WHERE pId=${item.menuId}`))).then(children => {
          res.status(200).$success(arrayHandle.parseToTree(children.reduce((pre, curr) => pre.concat(curr), result)))
        }).catch(err => {
          res.$err(err)
        })
      } else {
        res.status(200).$success(arrayHandle.parseToTree(result))
      }
    }).catch(err => {
      res.$err(err)
      console.log(err)
    })
  }
});

module.exports = router.router
