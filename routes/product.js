console.log('begin....')
const mysql = require('../api/mysql')
const RouterHandle = require('../utils/router-handler');
const router = new RouterHandle()

router.$post('/', async function({ body }, res, next) {
  console.log(111)
  console.log(process.env)
  console.log(mysql)
  mysql('SELECT * FROM menus').then((result) => {
    res.status(200).send(result);
  })
  .catch(err => {
    console.log(err)
  });
});

module.exports = router.router;
