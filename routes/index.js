const express = require('express');
const router = express.Router();
const loginRouter = require("./user/login");
const joinRouter = require("./user/join");
const apiRouter = require("./api/check");
const kakakoRouter = require("./auth/kakao");
const facebookRouter = require("./auth/facebook");
const naverRoter = require("./auth/naver");
const mypageRouter = require("./user/mypage");
const payRouter = require("./pay/pay");
const categoryRouter = require("./user/category");

router.use("/user", loginRouter);
router.use("/user", joinRouter);
router.use("/user", mypageRouter);
router.use("/user/category", categoryRouter);
router.use("/api", apiRouter);
router.use("/auth/kakao", kakakoRouter);
router.use("/auth/facebook", facebookRouter);
router.use("/auth/naver" ,naverRoter);
router.use("/pass/pay", payRouter);

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user){
    req.session.save(()=>{
      req.session.nick = req.user.nick;
      req.session.payment = req.user.payment;
      req.session.social = req.user.social;
      req.session.authority = req.user.authority;
      req.session.status = "logined";
      res.render("index");
    })
  } else {
    res.render('index');
  }
});

module.exports = router;
