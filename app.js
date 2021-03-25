var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser'); //这就是一个解析Cookie的工具。通过req.cookies可以取到传过来的cookie，并把它们转成对象。
var logger = require('morgan'); //在控制台中，显示req请求的信息

// 路由信息（接口地址），存放在routes的根目录
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var memberRouter = require('./routes/member');
var productRouter = require('./routes/product');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views')); //设置视图根目录
app.set('view engine', 'jade');

// 载入中间件
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//配置路由模块
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/member', memberRouter);
app.use('/product', productRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
