const RouterHandle = require('../utils/router-handler');
const router = new RouterHandle()
const path = require('path')

/* GET home page. */
router.$get('/', function({ body }, res, next) {
  res.sendFile(path.resolve('views/index.html'));
});

module.exports = router.router;
