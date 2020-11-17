const express = require("express");
const router = express.Router();
const passport = require("passport");
const NaverStrategy = require("passport-naver").Strategy;
const auth = require("../../bin/auth");
const db = require("../../bin/db");
const sha256 = require("sha256");

//-------------------------------------------------------------------------------------naver------------------------------------------------------------------------------------
passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(id, done) {
    done(null, id);
});

passport.use("naver-login", new NaverStrategy(auth.naver ,(accessToken, refreshToken, profile, done)=>{
    console.log(profile);
    const id = String("naver:"+profile._json.id);
    const nickName = profile.provider+String(profile.id).substring(0,4)+Math.floor(((Math.random()*100)+1));
    db.query("SELECT * FROM wf_user where email = ?",[id],(err, result)=>{
        if(result[0] === undefined){
            const NewUserPassword = sha256.x2("secret"+id);
            db.query("insert into wf_user(email,password,nick,social,joindate) values(?,?,?,2,now())",
            [id, NewUserPassword,nickName], (err, insert)=>{
                if(err) throw err;
                done(null, {nick : nickName, payment : false, social : true, authority : false})
            })
        } else if(result[0].social == 2){
            return done(null, {nick : result[0].nick, 
                payment : result[0].payment == 1 ? true : false, 
                social : result[0].social != 0 ? true : false, 
                authority : result[0].authority == 1 ? true : false})
        } else {
            return done(null ,false,{message : "Overlaped ID !!"});
        } 
    });
}));

router.get("/login", passport.authenticate("naver-login"));

router.get("/callback", passport.authenticate("naver-login", {
        successRedirect : "/",
        failureRedirect : "/user/login",
        failureFlash : true
    })
);

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = router;