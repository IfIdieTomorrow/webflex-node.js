const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require("body-parser");
const compression = require("compression");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const MySQLStore = require("express-mysql-session")(session);
const db = require("./bin/db");
const db_info = require("./bin/db_info");
db.connect();

const indexRouter = require('./routes/index');

const app = express();

// view engine setup
app.set('views', 
  [
    path.join(__dirname, 'views'),
    path.join(__dirname, 'views/user'),
    path.join(__dirname, 'views/footer'),
    path.join(__dirname, 'views/header'),
    path.join(__dirname, 'views/pay'),
    path.join(__dirname, "views/board")
  ]
);
app.set('view engine', 'ejs');

// middle ware
app.use(session({
  secret : "alkjsdkl213@123",
  resave : false,
  saveUninitialized : true,
  store : new MySQLStore(db_info)
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit : "20mb",extended : true, parameterLimit : "100000"}));
app.use(cookieParser());
app.use(express.static("public"));
// locals에 session에서 받아온 값을 저장하는 미들웨어
// 모든 ejs템플릿에서 세션값을 받아올 수 있다.
app.use(function(req, res, next) {
  // res.locals.user = req.session.user;
  // next();
  res.locals.nick = req.session.nick;
  res.locals.status = req.session.status;
  next(); 
});

// router
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(8080,()=>{
  console.log("Server is Running...");
})

module.exports = app;
