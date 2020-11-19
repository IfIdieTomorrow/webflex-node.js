const { request } = require("express");
const express = require("express");
const router = express.Router();
const db = require("../../bin/db");

router.get("/", (request, response)=>{
    if(request.session.status == undefined){
        response.redirect("/");
        return;
    }
    db.query("SELECT * FROM wf_pass", (err, pass)=>{
        if(err) throw err;
        response.render("payment",{pass_info : pass})
    })
});

router.post("/process" , (request, response)=>{
    if(request.session.status == undefined){
        response.redirect("/");
        return;
    }
    db.query("SELECT * FROM wf_pass WHERE pass_no=?",[request.body.pass_no],(err, pass)=>{
        if(err) throw err;
        response.render("payprocess",{pass_info : pass[0]})
    });
});

router.get("/success" , (request, response)=>{
    console.log(request.query.no);
    db.query("UPDATE wf_user SET payment = 1, paydate = now(), mop = ? , pass_no = ? where nick = ?",
        ['결제완료',request.query.no,request.session.nick],(err, result)=>{
            if(err) throw err;
            request.session.save(()=>{
                request.user.payment = 1;
                response.redirect("/user/mypage");
        });
    });
});

module.exports = router;