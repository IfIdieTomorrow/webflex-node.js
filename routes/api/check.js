const express = require("express");
const router = express.Router();
const db = require("../../bin/db");
const bcrypt = require("bcrypt");

// 이메일 중복검사
router.post("/email", (request,response)=>{
    db.query("SELECT * FROM wf_user WHERE email = ?",[request.body.email], (err, result)=>{
        if(err) throw err;
        if(result[0] === undefined){
            response.status(200).json({
                result : "OK"
            })
        } else {
            response.status(200).json({
                result : "Overlap"
            })
        }
    });
});

// 닉네임 중복검사
router.post("/nick", (request,response)=>{
    db.query("SELECT * FROM wf_user WHERE nick = ?",[request.body.nick], (err, result)=>{
        if(err) throw err;
        if(result[0] === undefined){
            response.status(200).json({
                result : "OK"
            })
        } else {
            response.status(200).json({
                result : "Overlap"
            })
        }
    });
});

// 비밀번호 확인
router.post("/password", (request, response)=>{
    const password = request.body.password;
    db.query("SELECT password FROM wf_user WHERE nick = ?",[request.session.nick],(err, result)=>{
        if(err) throw err;
        bcrypt.compare(password, result[0].password, (err, flag)=>{
            console.log(result[0].password)
            if(err) throw err;
            if(flag){
                response.status(200).json({
                    result : "OK"
                })
            } else {
                response.status(200).json({
                    result : "FAIL"
                })
            }
        });
    });
});

module.exports = router;

