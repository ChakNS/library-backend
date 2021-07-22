const $call = require('../utils/functions')
module.exports = (sql) => {
  return $call('tcb-mysql-ext', { sql }).then(res => res.result).catch(err => err)
}