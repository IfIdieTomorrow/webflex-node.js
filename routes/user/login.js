const express = require("express");
const router = express.Router();
const db = require("../../bin/db");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

// 로그인 폼
router.get("/login", (request, response)=>{
    if(request.session.nick !== undefined){
        response.redirect("/");
    }
    let msg;
    let errMsg = request.flash('error');
    if(errMsg !== undefined){
        msg = errMsg;
    }
    console.log(msg);
    response.render("login.ejs", {message : msg});
});

//---------------------------------------------------------------------passport를 이용한 로그인----------------------------------------------------------------------
passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(id, done) {
    done(null, id);
});

passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(request, email, password, done){
        db.query("SELECT * FROM wf_user WHERE email = ?",[email],(err, result)=>{
            if(err) throw err;
            if(result[0] === undefined){
                console.log("existed user");
                return done(null, false, {'message' : "Not found Email !!"});
            } else {
                bcrypt.compare(password, result[0].password, function(err, flag) {
                    if(err) throw err;
                    if(flag){
                        return done(null, {
                            nick :result[0].nick,
                            payment : result[0].payment == 1 ? true : false,
                            social : result[0].social != 0 ? true : false,
                            authority : result[0].authority == 1 ? true : false});
                    } else {
                        return done(null, false, {message : "Not equal Password !!"})
                    }
                });
            }
        });
    }
));

router.post("/login", passport.authenticate("local-login", {
    successRedirect : "/",
    failureRedirect : "/user/login",
    failureFlash : true
}));

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// 로그아웃
router.get("/logout" ,(request, response)=>{
    request.logOut();
    delete request.session.nick;
    delete request.session.payment;
    delete request.session.social;
    delete request.session.authority;
    response.redirect("/");
});

module.exports = router;