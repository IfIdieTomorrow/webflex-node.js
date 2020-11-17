const express = require("express");
const router = express.Router();
const db = require("../../bin/db");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const saltRounds = 10;

// 회원가입 폼
router.get("/join", (request, response)=>{
    if(request.session.nick !== undefined){
        response.redirect("/");
    }
    let msg;
    let errMsg = request.flash('error');
    if(errMsg !== undefined){
        msg = errMsg;
    }
    console.log(msg);
    response.render("join.ejs", {message : msg});
});


function listIndex(list, index){
    let flag = false;
    for(let idx of list){
        if(idx == index){
            flag = true;
        }
    }
    return flag;
}

//---------------------------------------------------------------------------------passport를 이용한 로그인----------------------------------------------------------------------
passport.serializeUser(function(user, done) {
    done(null, user.message);
});
  
passport.deserializeUser(function(id, done) {
    done(null, id);
});

passport.use('local-join', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(request, email, password, done){
        console.log(email, password, request.body);
        db.query("SELECT * FROM wf_user WHERE email = ?",[email],(err, result)=>{
            if(err) throw err;
            if(result[0] === undefined){
                db.query("SELECT * FROM wf_user WHERE nick = ?",[request.body.nick], (err2, result2)=>{
                    if(err2) throw err2;
                    if(result2[0] === undefined){
                        bcrypt.genSalt(saltRounds, (err, salt)=>{
                            if(err) throw err;
                            bcrypt.hash(password, salt, (err,hash)=>{
                                db.query("INSERT INTO wf_user(email,password,nick,joindate) VALUES(?,?,?,NOW())",
                                    [email,hash,request.body.nick],(err3, result3)=>{
                                        if(err3) throw err3;
                                        return done(null, {
                                        message : "success"
                                    })
                                })
                            })
                        });
                    } else {
                        return done(null, false, {message : "Overlaped Nickname !!"});
                    }
                });
            } else {
                return done(null, false, {message : "Overlaped Email !!"} );
            }
        });
    }
));

router.post("/join", passport.authenticate("local-join", {
    successRedirect : "/user/login",
    failureRedirect : "/user/join",
    failureFlash : true
}));

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = router;