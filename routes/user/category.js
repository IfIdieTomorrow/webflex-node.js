const express = require("express");
const router = express.Router();
const db = require("../../bin/db");
const bcrypt = require("bcrypt");

router.get("/add", (request, response)=>{
    if(request.session.status === undefined){
        response.redirect("/");
        return;
    }
    db.query("SELECT category FROM wf_user WHERE nick = ?",[request.session.nick],(err, result)=>{
        if(err) throw err;
        let category = null;
        if(result[0].category != null){
            category = result[0].category.split("/");
        }
        console.log(category);
        response.render("category",{category : category})
    });
});

router.post("/add", (request, response)=>{
    let categoryArr = request.body.category;
    console.log(categoryArr);
    let category = null;
    let dbCategory = null;
    if(categoryArr != undefined){ 
        if(typeof categoryArr == "object"){
            category = Array.from(categoryArr).join("/");
        } else {
            category = categoryArr;
        }
        console.log(category);
    } 
    db.query("UPDATE wf_user SET category = ? WHERE nick = ?",[category, request.session.nick], (err, result)=>{
        if(err) throw err;
        response.redirect("/user/mypage");
    });
});

router.get("/remove", (request, response)=>{
    if(request.session.status === undefined){
        response.redirect("/");
        return;
    }
    db.query("UPDATE wf_user SET category = null WHERE nick = ?",[request.session.nick], (err, result)=>{
        if(err) throw err;
        response.redirect("/user/mypage");
    });
});

module.exports = router;