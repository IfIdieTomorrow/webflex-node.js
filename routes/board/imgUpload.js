const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination : (request, file, cb)=>{
    cb(null, './public/uploads/') // 콜백 함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename : (request, file, cb)=> {
    cb(null, file.originalname) // 콜백함수를 통해 전송된 파일 이름 설정
  }
});
const upload = multer({storage : storage})

router.post("/", upload.array("file"),(request, response)=>{
    console.log(request.files);
    response.status(200).json({
        url : "../uploads/"+request.files[0].filename
    })
});
  

module.exports = router;
