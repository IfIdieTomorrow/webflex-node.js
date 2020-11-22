const express = require("express");
const router = express.Router();
const db = require("../../bin/db");

router.get("/list", (request, response)=>{
    response.redirect("/notice/list/1");
});

router.get("/list/:page",(request, response)=>{
    const page = request.params.page;
    let sql = "select * from wf_notice;";
    db.query(sql, [], function(err, rows){
        if(err) throw err;
        db.query("select count(*) AS cnt from wf_notice", function(err, rows){
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
            db.query("select nno, title, writer, cont, hit, date_format(noticedate, '%Y / %m / %d') from wf_notice order by nno desc limit ?,?",
            [begin, size], function(err, rows){
                if(err) throw err;
                // console.log('rows',rows);
                const datas = {
                    notice: rows,
                    page: page,
                    pageSize: pageSize,
                    startPage: startPage,
                    endPage: endPage,
                    totalPage: totalPage,
                    max: max
                };
                response.render("noticeList",{notice:datas})
            });
        });
    });
})

router.get("/cont", (request, response)=>{
    db.query("SELECT nno, title, writer, cont, hit, date_format(noticedate,'%Y / %m / %d') FROM wf_notice WHERE nno = ?",[request.query.nno],(err, notice)=>{
        if(err) throw err;
        db.query("UPDATE wf_notice SET hit = hit+1 WHERE nno = ?",[request.query.nno],(err)=>{
            if(err) throw err;
            response.render("noticeCont",{
                notice:notice[0],
            });            
        });
    });
});

module.exports = router;