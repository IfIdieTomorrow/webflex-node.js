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
        response.redirect("/board/list/1");
    })
});

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//글 내용

router.get("/cont", (request, response)=>{
    db.query("SELECT bno, email, title, writer, cont, hit, date_format(writedate,'%Y / %m / %d') FROM wf_board WHERE bno = ?",[request.query.bno],(err, board)=>{
        if(err) throw err;
        db.query("UPDATE wf_board SET hit = hit+1 WHERE bno = ?",[request.query.bno],(err)=>{
            if(err) throw err;
            db.query("SELECT rno, bno, writer, cont, date_format(replydate,'%Y / %m / %d') FROM wf_reply WHERE bno = ? ORDER BY rno DESC",[request.query.bno],(err, reply)=>{
                if(err) throw err;
                db.query("SELECT count(*) AS cnt FROM wf_reply WHERE bno = ?",[request.query.bno],(err, cnt)=>{
                    response.render("boardCont",{
                        board:board[0],
                        reply:reply,
                        cnt : cnt[0].cnt
                    });
                })
            });
        });
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

//----------------------------------------------------------------------------------------------페이징 ----------------------------------------------------------------------------------------------------------
router.get('/list/:page',(request,response)=>{
    const page = request.params.page;
    let sql = "select * from wf_board;";
    db.query(sql, [], function(err, rows){
        if(err) throw err;
        db.query("select count(*) AS cnt from wf_board", function(err, rows){
            if(err){ console.error('err',err); }
            // console.log("rows", rows); //[{cnt:1}]
            let cnt = rows[0].cnt;
            let size = 10; // 보여줄 글의 수
            let begin = (page - 1) * size; // 시작 글
            let totalPage = Math.ceil(cnt/size);
            let pageSize = 10; // 링크 갯수
            let startPage = Math.floor((page-1)/pageSize)*pageSize+1;
            let endPage = startPage + (pageSize - 1);
            if(endPage > totalPage){
                endPage = totalPage;
            }
            let max = cnt - ((page-1)*size);
            db.query("select bno, title, writer, cont, hit, date_format(writedate, '%Y / %m / %d') from wf_board order by bno desc limit ?,?",
            [begin, size], function(err, rows){
                if(err) throw err;
                // console.log('rows',rows);
                const datas = {
                    board: rows,
                    page: page,
                    pageSize: pageSize,
                    startPage: startPage,
                    endPage: endPage,
                    totalPage: totalPage,
                    max: max
                };
                response.render("boardList",{board:datas})
            });
        });
    });
});


module.exports = router;