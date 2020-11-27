const express = require("express");
const router = express.Router();
const db = require("../../bin/db");

router.get("/list", (request, response)=>{
    if(request.session.status == undefined){
        response.redirect("/user/login");
        return;
    }else if(!request.session.payment){
        response.redirect("/pass/pay")
    }
    let rand = Math.floor((Math.random() * 3)+1);
    db.query("SELECT * FROM movie WHERE category = '액션'",(err, actionMovie)=>{
        if(err) throw err;
        db.query("SELECT * FROM movie WHERE category = '로맨스'",(err, romanceMovie)=>{
            if(err) throw err;
            db.query("SELECT * FROM movie WHERE category = 'SF'",(err, sfMovie)=>{
                if(err) throw err;
                db.query("SELECT * FROM movie WHERE category = '코메디'",(err, comedyMovie)=>{
                    if(err) throw err;
                    db.query("SELECT * FROM movie WHERE category = '스릴러'",(err, thrillerMovie)=>{
                        if(err) throw err;
                        db.query("SELECT * FROM movie WHERE category = '음악'",(err, musicMovie)=>{
                            if(err) throw err;
                            db.query("SELECT * FROM movie WHERE category = '애니메이션'",(err, animationMovie)=>{
                                if(err) throw err;
                                db.query("SELECT * FROM movie WHERE category = '판타지'",(err, fantasyMovie)=>{
                                    if(err) throw err;
                                    db.query("SELECT * FROM movie WHERE category = '드라마'",(err, dramaMovie)=>{
                                        if(err) throw err;
                                        response.render("movieList",{
                                            rand : rand,
                                            action : actionMovie,
                                            romance : romanceMovie,
                                            SF : sfMovie,
                                            comedy : comedyMovie,
                                            thriller : thrillerMovie,
                                            music : musicMovie,
                                            animation : animationMovie,
                                            fantasy : fantasyMovie,
                                            drama : dramaMovie
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

router.get("/info",(request, response)=>{
    if(request.session.status == undefined){
        response.redirect("/user/login");
        return;
    }else if(!request.session.payment){
        response.redirect("/pass/pay")
    }
    const movieId = request.query.movieId;
    db.query("SELECT * FROM movie WHERE id = ?",[movieId],(err, movie)=>{
        response.render("movieInfo",{movie:movie[0]});
    });
});

router.get("/newContents", (request, response)=>{
    if(request.session.status == undefined){
        response.redirect("/user/login");
        return;
    }else if(!request.session.payment){
        response.redirect("/pass/pay")
    }
    db.query("SELECT * FROM movie WHERE DATEDIFF(now(),moviedate) <= 1 ORDER BY id DESC", (err, day)=>{
        if(err) throw err;
        db.query("SELECT * FROM movie WHERE DATEDIFF(now(),moviedate) <= 30 ORDER By id DESC;",(err, month)=>{
            if(err) throw err;
            db.query("SELECT * FROM movie WHERE category = '액션' or category = '판타지' ORDER BY id DESC",(err, power)=>{
                if(err) throw err;
                db.query("SELECT * FROM movie WHERE category = '로맨스' or category = '음악' ORDER BY id DESC",(err, love)=>{
                    if(err) throw err
                    response.render("newContent", {
                        month : month,
                        day : day,
                        power : power,
                        love : love
                    })
                });
            });
        });
    })
});

router.get("/search" ,(request, response)=>{
    if(request.session.status == undefined){
        response.redirect("/user/login");
        return;
    }else if(!request.session.payment){
        response.redirect("/pass/pay")
    }
    const key = "%"+request.query.key+"%";
    db.query("SELECT * FROM movie WHERE actor LIKE ? OR category LIKE ? OR title LIKE ? OR sub_title LIKE ?",[key,key,key,key],(err, result)=>{
        if(err) throw err;
        console.log(result);
        response.render("searchView", {search : result, keyword : request.query.key})
    });
});
module.exports = router;