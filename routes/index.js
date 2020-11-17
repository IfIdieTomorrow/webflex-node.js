const express = require('express');
const router = express.Router();
const loginRouter = require("./user/login");
const joinRouter = require("./user/join");
const apiRouter = require("./api/check");
const kakakoRouter = require("./auth/kakao");
const facebookRouter = require("./auth/facebook");
const naverRoter = require("./auth/naver");
const mypageRouter = require("./user/mypage");

router.use("/user", loginRouter);
router.use("/user", joinRouter);
router.use("/user", mypageRouter);
router.use("/api", apiRouter);
router.use("/auth/kakao", kakakoRouter);
router.use("/auth/facebook", facebookRouter);
router.use("/auth/naver" ,naverRoter);

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user){
    req.session.nick = req.user.nick;
    req.session.payment = req.user.payment;
    req.session.social = req.user.social;
    req.session.authority = req.user.authority;
  }
  console.log("req.user : ",req.user);
  console.log("req.session : ",req.session);
  res.render('index', { title: 'Express' });
});

module.exports = router;
