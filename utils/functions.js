const cloudbase = require("@cloudbase/node-sdk")
const app = cloudbase.init({
  env: process.env.TCB_ENV_ID,
  secretId: process.env.TCB_SECRET_ID,
  secretKey: process.env.TCB_SECRET_KEY
});

/**
 * @description 云函数调用
 * @param {String} name 云函数名称
 * @param {Object} data 传给云函数的参数
 * @return {Promise} 返回promise实例
 * @user fmz
 * @date 2020-02-18 15:59:58
**/
module.exports = (name, data) => {
  return app.callFunction({ name, data }).then(res => res).catch(err => err)
}