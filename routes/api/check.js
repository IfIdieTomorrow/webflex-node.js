const express = require("express");
const router = express.Router();
const db = require("../../bin/db");

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

module.exports = router;

