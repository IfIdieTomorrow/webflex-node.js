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
    path.join(__dirname, 'views/header')
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
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
