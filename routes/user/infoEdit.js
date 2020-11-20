const express = require("express");
const router = express.Router();
const db = require("../../bin/db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// 로컬계정 닉네임 변경
router.get("/local/nick/update", (request, response)=>{
    if(request.session.status === undefined){
        response.redirect("/");
        return;
    }
    response.render("localNickChange");
});

router.post("/local/nick/update", (request, response)=>{
    const nick = request.body.nick;
    const password = request.body.password;
    db.query("SELECT * FROM wf_user WHERE nick = ?",[nick],(err, user)=>{
        if(err) throw err;
        if(user[0] != undefined) {
            response.status(200).json({
                result : "Overlap"
            })
        } else {
            db.query("SELECT * FROM wf_user WHERE nick = ?",[request.session.nick],(err , cUser)=>{
                if(err) throw err;
                bcrypt.compare(password, cUser[0].password, function(err, flag) {
                    if(err) throw err;
                    if(flag){
                        db.query("UPDATE wf_user SET nick = ? WHERE nick = ?",[nick, request.session.nick],(err, user)=>{
                            if(err) throw err;
                            request.session.save(()=>{
                                request.user.nick = nick;
                                request.session.nick = nick;
                                response.status(200).json({
                                    result : "OK"
                                });
                            })
                            
                        });
                    } else {
                        response.status(200).json({
                            result : "FAIL"
                        })
                    }
                });
            })
        }
    });
});

// 소셜계정 닉네임 변경
router.get("/social/nick/update", (request, response)=>{
    if(request.session.status === undefined){
        response.redirect("/");
        return;
    }
    response.render("socialNickChange");
});

router.post("/social/nick/update", (request, response)=>{
    const nick = request.body.nick;
    db.query("SELECT * FROM wf_user WHERE nick = ?",[nick],(err, result)=>{
        if(err) throw err;
        if(result[0] != undefined){
            response.status(200).json({
                result : "Overlap"
            })
        } else {
            db.query("UPDATE wf_user SET nick = ? WHERE nick = ?",[nick, request.session.nick],(err, user)=>{
                if(err) throw err;
                request.session.save(()=>{
                    request.user.nick = nick;
                    request.session.nick = nick;
                    response.status(200).json({
                        result : "OK"
                    });
                })
            })
        }
    });
});

// 로컬계정 비밀번호 변경
router.get("/local/pass/update", (request, response)=>{
    if(request.session.status === undefined){
        response.redirect("/");
        return;
    } else if(request.session.social == true) {
        response.redirect("/user/mypage");
        return;
    }
    response.render("passwordChange");
});

router.post("/local/pass/update", (request, response)=>{
    const password = request.body.password;
    const cPassword = request.body.cPassword;
    db.query("SELECT password FROM wf_user WHERE nick = ?", [request.session.nick],(err, result)=>{
        if(err) throw err;
        bcrypt.compare(password, result[0].password,(err,flag)=>{
            if(err) throw err;
            if(flag) {
                bcrypt.genSalt(saltRounds, (err, salt)=>{
                    if(err) throw err;
                    bcrypt.hash(cPassword, salt, (err,hash)=>{
                        if(err) throw err;
                        db.query("UPDATE wf_user SET password = ? WHERE nick = ?", [hash,request.session.nick],(err, user)=>{
                            if(err) throw err;
                            response.status(200).json({
                                result : "OK"
                            })
                        })
                    })
                });
            } else {
                response.status(200).json({
                    result : "FAIL"
                })
            }
        })
    });
});

// 강제 비밀번호 업데이트
router.post("/local/pass/change", (request, response)=>{
    const password = request.body.password;
    bcrypt.genSalt(saltRounds, (err, salt)=>{
        if(err) throw err;
        bcrypt.hash(password, salt, (err,hash)=>{
            if(err) throw err;
            db.query("UPDATE wf_user SET password = ? WHERE nick = ?", [hash,request.session.nick],(err, user)=>{
                if(err) throw err;
                response.status(200).json({
                    result : "OK"
                })
            })
        })
    });
});

module.exports = router;
