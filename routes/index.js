const RouterHandle = require('../libs/router-handler');
const router = new RouterHandle()
const path = require('path')

/* GET home page. */
router.$post('/', function({ body }, res, next) {
  res.sendFile(path.resolve('views/index.html'));
});

module.exports = router.router;
