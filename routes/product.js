// const express = require('express');
const RouterHandle = require('../libs/router-handler');
// const path = require('path')
const router = new RouterHandle()
/* GET home page. */
router.$post('/', function({ body }, res, next) {
  res.status(200).send('product1111');
});

module.exports = router.router;
