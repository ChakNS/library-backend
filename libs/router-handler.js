const express = require('express');
class RouterHandle {
  constructor () {
    this.router = express.Router()
  }
  $post (path, callback) {
    this.router.post(path, function (req, res, next) {
      res.$success = (data) => {
        res.json({
          data,
          status: 'SUCCESS'
        })
      }
      res.$err = (err) => {
        res.json({
          errors: err,
          status: 'FAIL'
        })
      }
      callback({ body: req.body, params: req.params }, res, next)
    })
  }
  $get (path, callback) {
    this.router.get(path, function (req, res, next) {
      callback(req, res, next)
    })
  }
}
module.exports = RouterHandle;