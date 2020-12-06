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
const EditRouter = require("./user/infoEdit");
const mailRouter = require("./user/email");
const boardRouter = require("./board/board");
const imgUploadRouter = require("./board/imgUpload");
const replyRouter = require("./board/reply/reply");
const noticeRouter = require("./notice/notice");
const signOutRouter = require("./user/signout");
const movieRouter = require("./webflexMovie/movie");
// 파일 업로드
const multer = require("multer");
const storage = multer.diskStorage({
  destination : (request, file, cb)=>{
    cb(null, 'C:\\upload') // 콜백 함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename : (request, file, cb)=> {
    cb(null, file.originalname) // 콜백함수를 통해 전송된 파일 이름 설정
  }
});
const upload = multer({storage : storage})
// 메일 
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const adminMail = require("../bin/mail_info");
const { request } = require('express');
const smtpTransport = nodemailer.createTransport(adminMail);
//--------------------------------------------------------
router.use("/user", loginRouter);
router.use("/user", joinRouter);
router.use("/user", mypageRouter);
router.use("/user", EditRouter);
router.use("/user/category", categoryRouter);
router.use("/user/mail", mailRouter);
router.use("/user/signout", signOutRouter);
//--------------------------------------------------------
router.use("/api", apiRouter);
//--------------------------------------------------------
router.use("/auth/kakao", kakakoRouter);
router.use("/auth/facebook", facebookRouter);
router.use("/auth/naver" ,naverRoter);
//--------------------------------------------------------
router.use("/pass/pay", payRouter);
//--------------------------------------------------------
router.use("/board" , boardRouter);
router.use("/uploadSummernoteImageFile", imgUploadRouter);
router.use("/board/reply", replyRouter);
//--------------------------------------------------------
router.use("/notice", noticeRouter);
//--------------------------------------------------------
router.use("/movie", movieRouter);
//--------------------------------------------------------

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user){
    req.session.save(()=>{
      req.session.nick = req.user.nick;
      req.session.payment = req.user.payment;
      req.session.social = req.user.social;
      req.session.authority = req.user.authority;
      req.session.status = "logined";
      res.redirect("/user/mypage");
    })
  } else {
    res.render('index');
  }
});


//--------------------------------------------------------------TEST----------------------------------------------------------------------------------
router.get("/file/test", (request, response)=>{
  response.render("test");
});

router.post("/file/upload", upload.array("files") ,(request, response)=>{
  response.send("Uploaded! : "+ request.files);
  console.log(request.files);
});

router.get("/mail/test", (request, response)=>{
  response.render("mailTest");
});
router.post('/mail/test', async(request, response) => {
  let authNum = Math.random().toString().substr(2,6);

  let emailTemplete;
  ejs.renderFile('C:\\Users\\kwanhee\\Desktop\\WEBFLEX\\webflex\\views\\mailtemplate.ejs', {nick : request.session.nick ,authCode : authNum}, function (err, data) {
    if(err){console.log('ejs.renderFile err')}
    emailTemplete = data;
  });

  const mailOptions = {
    from: adminMail.auth.user,
    to: "chuck46@naver.com",
    subject: "WEBFLEX 인증코드",
    html : emailTemplete 
  };

  await smtpTransport.sendMail(mailOptions, (error, responses) =>{
      if(error){
          response.json({msg:'err'});
      }else{
          response.json({msg:'sucess'});
      }
      smtpTransport.close();
  });
  console.log(authNum);
});

//-------------------------------------------------------------------------------------------------------------------------------------------------------------

router.get("/test", (request, response)=>{
  response.render("noteTest")
})

module.exports = router;
