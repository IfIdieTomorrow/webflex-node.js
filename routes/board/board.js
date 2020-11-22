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

async function paging(curPage, totalRowCount) { // 페이지당 게시물 수 
    let page_size = 10; // 보여지는 페이지의 갯수 : 1 ~ 5 페이지 
    let page_list_size = 10; // limit 변수 (DB에서 가져올 게시물 수 no~ 
    let no = 0; // 인자로 받은 현재 페이지 번호 

    curPage = Number(curPage) 
    if (curPage <= 0) { 
        no = 0; curPage = 1; 
    } else{
        no = (curPage - 1) * page_size; // 전체 페이지 갯수 
    } 

    if (totalRowCount < 0) totalRowCount = 0; 
    let totalPage = Math.ceil(totalRowCount / page_size); // 전체 페이지 수 
    if (totalPage < curPage) { 
        no = 0; curPage = 1 // totalPage 보다 더 큰 curPage가 호출되면 에러 발생시키기 
    } 

    let startPage = ((curPage - 1) * page_list_size) + 1; // 시작 페이지 계산 
    let endPage = (startPage + page_list_size) - 1; // 마지막 페이지 계산 

    let result = { 
        "curPage": curPage,
        "page_list_size": page_list_size,
        "page_size": page_size,
        "totalPage": totalPage,
        "startPage": startPage, 
        "endPage": endPage, 
        "no": no 
    }
    return result; 
}

//----------------------------------------------------------------------------------------------페이징 테스트 ----------------------------------------------------------------------------------------------------------
// router.get('/list/:page',(request,response)=>{
//     const page = request.params.page;
//     db.query("SELECT COUNT(*) AS cnt FROM wf_board",(err, cnt)=>{
//         if(err) throw err;
//         let pageInfo = paging(page, cnt[0].cnt);
//     });
    
// });

module.exports = router;