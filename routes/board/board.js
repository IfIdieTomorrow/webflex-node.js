const { request, response } = require("express");
const express = require("express");
const router = express.Router();
const db = require("../../bin/db");

//---------------------------------------------------------------------------글 쓰기--------------------------------------------------------------------------------------------------
router.get("/write" , (request, response)=>{
    if(request.session.status === undefined){
        response.redirect("/");
        return;
    }
    response.render("boardWrite")
});

router.post("/write", (request, response)=>{
    db.query("SELECT * FROM wf_user WHERE nick = ?",[request.session.nick],(err, user)=>{
        if(err) throw err;
        const title = request.body.title;
        const cont = request.body.cont;
        db.query("INSERT INTO wf_board(email,title,writer,cont,writedate) VALUES(?,?,?,?,now())",[user[0].email, title, user[0].nick, cont],(err, result)=>{
            if(err) throw err;
            response.status(200).json({
                result : "OK"
            })
        });
    });
});

//--------------------------------------------------------------------------- 글 목록--------------------------------------------------------------------------------------------------

router.get("/list", (request, response)=>{
    db.query("SELECT bno, title, writer, cont, hit, date_format(writedate,'%Y / %m / %d') FROM wf_board ORDER BY bno DESC",(err, boardList)=>{
        if(err) throw err;
        response.render("boardList",{board:boardList})
    })
});

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//글 내용

router.get("/cont", (request, response)=>{
    db.query("SELECT bno, email, title, writer, cont, hit, date_format(writedate,'%Y / %m / %d') FROM wf_board WHERE bno = ?",[request.query.bno],(err, board)=>{
        if(err) throw err;
        response.render("boardCont",{board:board[0]});
    });
});

//이 부분에 댓글도 추가

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// 글 수정화면
router.get("/edit", (request, response)=>{
    db.query("SELECT bno, email, title, writer, cont, hit, date_format(writedate,'%Y / %m / %d') FROM wf_board WHERE bno = ?",[request.query.bno],(err, board)=>{
        if(err) throw err;
        response.render("boardEdit",{board:board[0]});
    });
});

// 글 수정
router.post("/edit", (request, response)=>{
    const bno = request.body.bno;
    const title = request.body.title;
    const cont = request.body.cont;
    db.query("UPDATE wf_board SET title = ? , cont = ? WHERE bno=?",[title,cont,bno],(err, result)=>{
        if(err) throw err;
        response.status(200).json({
            result : "OK"
        });
    });
});

// 글 삭제
router.delete("/delete", (request, response)=>{
    let bno = request.body.bno;
    db.query("DELETE FROM wf_board WHERE bno = ?",[bno],(err, result)=>{
        if(err) throw err;
        response.status(200).json({
            result : "OK"
        })
    });
});

module.exports = router;