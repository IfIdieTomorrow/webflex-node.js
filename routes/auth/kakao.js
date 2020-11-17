const express = require("express");
const router = express.Router();
const auth = require("../../bin/auth");
const KakaoStrategy = require("passport-kakao").Strategy;
const passport = require("passport");
const sha256 = require("sha256");
const db = require("../../bin/db");

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(id, done) {
    done(null, id);
});

passport.use("kakao-login", new KakaoStrategy(auth.kakao,(accessToken, refreshToken, profile, done)=>{
    const id = String("kakao:"+profile.id);
    const nickName = profile.provider+profile.username+String(profile.id).substring(0,3);
    db.query("SELECT * FROM wf_user where email = ?",[id],(err, result)=>{
        if(result[0] === undefined){
            const NewUserPassword = sha256.x2('secret'+id);
            db.query("insert into wf_user(email,password,nick,social,joindate) values(?,?,?,1,now())",
            [id, NewUserPassword,nickName], (err, insert)=>{
                if(err) throw err;
                done(null, {nick : nickName, payment : false, social : true, authority : false})
            })
        } else if(result[0].social == 1){
            return done(null, {nick : result[0].nick, 
                payment : result[0].payment == 1 ? true : false, 
                social : result[0].social != 0 ? true : false, 
                authority : result[0].authority == 1 ? true : false})
        } else {
            return done(null ,false,{message : "Overlaped ID !!"});
        } 
    });
}));

router.get("/login", passport.authenticate("kakao-login"));

router.get("/callback", passport.authenticate("kakao-login", {
        successRedirect : "/",
        failureRedirect : "/user/login",
        failureFlash : true
    })
);

module.exports = router;


