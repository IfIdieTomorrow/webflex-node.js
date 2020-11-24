const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../../bin/db")

router.get("/local", (request ,response)=>{
    if(request.session.status === undefined){
        response.redirect("/");
        return;
    } else if(request.session.social == true){
        response.redirect("/user/signout/social");
        return;
    }
    response.render("localSignOut");
});

router.post("/local", (request, response)=>{
    const password = request.body.password;
    db.query("SELECT password FROM wf_user WHERE nick = ?",[request.session.nick],(err, user)=>{
        if(err) throw err;
        bcrypt.compare(password, user[0].password,(err, flag)=>{
            if(flag){
                db.query("DELETE FROM wf_user WHERE nick = ?",[request.session.nick],(err, result)=>{
                    if(err) throw err;
                    db.query("DELETE FROM wf_reply WHERE writer = ?",[request.session.nick],(err, result)=>{
                        if(err) throw err;
                        db.query("DELETE FROM wf_board WHERE writer = ?",[request.session.nick],(err, result)=>{
                            if(err) throw err;
                            response.status(200).json({
                                result : "OK"
                            })
                        })
                    })
                })
            }else {
                response.status(200).json({
                    result : "FAIL"
                })
            }
        })
    });
});

router.get("/social", (request ,response)=>{
    if(request.session.status === undefined){
        response.redirect("/");
        return;
    } else if(request.session.social == false){
        response.redirect("/user/signout/local");
        return;
    }
    response.render("socialSignOut");
});

router.post("/social", (request, response)=>{
    db.query("DELETE FROM wf_user WHERE nick = ?",[request.session.nick],(err, result)=>{
        if(err) throw err;
        db.query("DELETE FROM wf_reply WHERE writer = ?",[request.session.nick],(err, result)=>{
            if(err) throw err;
            db.query("DELETE FROM wf_board WHERE writer = ?",[request.session.nick],(err, result)=>{
                if(err) throw err;
                response.status(200).json({
                    result : "OK"
                })
            })
        })
    })        
});

module.exports = router;