const express = require("express");
const router = express.Router();
const db = require("../../../bin/db");


// 댓글 추가
router.post("/add", (request, response)=>{
    const bno = request.body.bno;
    const cont = request.body.cont;
    const writer = request.session.nick;
    db.query("SELECT email FROM wf_user WHERE nick = ?",[writer],(err, user)=>{
        if(err) throw err;
        db.query("INSERT INTO wf_reply(bno,email,writer,cont,replydate) VALUES(?,?,?,?,now())",[bno,user[0].email,writer,cont],(err, result)=>{
            if(err) throw err;
            response.status(200).json({
                result : "OK"
            })
        });
    });
});

// 댓글 삭제
router.delete("/delete", (request, response)=>{
    const rno = request.body.rno;
    db.query("DELETE FROM wf_reply WHERE rno = ?",[rno],(err, result)=>{
        if(err) throw err;
        response.status(200).json({
            result : "OK"
        })
    })
});

//댓글 수정
router.put("/edit", (request, response)=>{
    console.log(request.body.rno);
    console.log(request.body.cont);
    db.query("UPDATE wf_reply SET cont = ? WHERE rno = ?",[request.body.cont, request.body.rno],(err, result)=>{
        if(err) throw err;
        response.status(200).json({
            result : "OK"
        })
    });
});

module.exports = router;
