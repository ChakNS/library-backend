const RouterHandle = require('../libs/router-handler');
const router = new RouterHandle()

router.$post('/', function({ body }, res, next) {
  res.status(200).send(body);
});

module.exports = router.router;
