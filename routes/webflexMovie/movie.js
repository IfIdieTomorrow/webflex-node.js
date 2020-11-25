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
                        response.render("movieList",{
                            rand : rand,
                            action : actionMovie,
                            romance : romanceMovie,
                            SF : sfMovie,
                            comedy : comedyMovie,
                            thriller : thrillerMovie
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
module.exports = router;