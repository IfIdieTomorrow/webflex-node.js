const express = require("express");
const router = express.Router();
const db = require("../../bin/db");
const moment = require('moment');

router.get("/mypage", (request, response)=>{
    if(request.session.nick === undefined){
        response.redirect("/");
    } else {
        db.query("SELECT * FROM wf_user WHERE nick = ?",[request.session.nick],(err, user)=>{
            if(err) throw err;
            console.log(user[0]);
            let date = moment(user[0].paydate).format('YYYY/MM/DD');
            let category = null;
            if (user[0].category != null){
                if(user[0].category.indexOf("/") != -1){
                    category = user[0].category.split("/");
                } else {
                    category = user[0].category;
                }
            }
            response.render("mypage",{ user : {
                    email: user[0].email,
                    nick : user[0].nick,
                    category : category,
                    mop : user[0].mop,
                    pass_no : user[0].pass_no == 100 ? "STANDARD" : "PREMIUM",
                    paydate : date,
                    authority : user[0].authority != 0 ? true : false,
                    social : user[0].social != 0 ? true : false,
                    payment : user[0].payment != 0 ? true : false
                }
            });
        })
    }
});

module.exports = router;