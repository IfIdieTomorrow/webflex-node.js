const express = require("express");
const db = require("../../bin/db");
// 메일 
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const adminMail = require("../../bin/mail_info");
const smtpTransport = nodemailer.createTransport(adminMail);
const router = express.Router();

router.get("/access", (request, response)=>{
    if(request.session.status === undefined){
        response.redirect("/");
        return;
    } else if(request.session.social == true) {
        response.redirect("/user/mypage");
        return;
    }
    db.query("SELECT email FROM wf_user WHERE nick = ?",[request.session.nick], (err, result)=>{
        if(err) throw err;
        response.render("email", {email : result[0].email});
    })
});

router.post("/access", async(request, response)=>{
    let authNum = Math.random().toString().substr(2,6);
    let emailTemplete;
    ejs.renderFile('C:\\Users\\kwanhee\\Desktop\\GitHub\\WEBFLEX\\webflex\\views\\mailtemplate.ejs', {nick : request.session.nick ,authCode : authNum}, function (err, data) {
    if(err){console.log('ejs.renderFile err')}
        emailTemplete = data;
    });
    const mailOptions = {
    from: adminMail.auth.user,
    to: request.body.email,
    subject: "WEBFLEX 인증코드",
    html : emailTemplete 
    };
    await smtpTransport.sendMail(mailOptions, (error, responses) =>{
        if(error){
            response.status(200).json({msg:'err'});
        }else{
            response.status(200).json({msg:'sucess', code : authNum});
        }
        smtpTransport.close();
    });
});

module.exports = router;