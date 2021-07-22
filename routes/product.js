const mysql = require('../api/mysql')
const RouterHandle = require('../libs/router-handler');
const router = new RouterHandle()

router.$post('/', async function({ body }, res, next) {
  mysql('SELECT * FROM menus').then((result) => {
    res.status(200).send(result);
  })
  .catch(err => {
    console.log(err)
  });
});

module.exports = router.router;
