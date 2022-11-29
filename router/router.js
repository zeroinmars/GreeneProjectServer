const { spawn } = require("child_process");
const { EDESTADDRREQ } = require("constants");
const express = require("express");
const conn = require("../config")
const router = express.Router();

router.post("/lifeConcierge/api/signup", (req,res)=>{
  const sql = "insert into userinfo values (null, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), 0, null);";
  const params = [req.body.email, req.body.pw, req.body.name, req.body.gender, req.body.birthday, req.body.job, req.body.hAddr, req.body.cAddr, req.body.disease, 
    req.body.transpo, req.body.hobby, req.body.food, req.body.drink, req.body.mbti, req.body.fashion, req.body.music
  ]
  console.log(params);

  conn.query(sql, params, (err, rows)=>{
    if(err) {
      console.log("에러");
      res.json(err);
    }else if (rows.length == 0){
      console.log ("값이 없음")
      res.json(err);
    }else {
      console.log(rows);
      res.json(rows)
    }
  })
})

router.post("/lifeConcierge/api/login",(req,res)=>{
  const email = req.body.email;
  const pw = req.body.pw;
  console.log(`전달받은 email : ${email}, pw : ${pw}`);
  const sql = 'select * from userinfo where email=? and pw=?';
  
  conn.query(sql, [email, pw], (err, rows) => {
    if (err){
      console.log("에러 발생");
    } else if (rows.length == 0) {
      console.log('id가 없습니다.');
      res.json("NoneId");
    } else {
      req.session.user = rows[0];
      console.log(req.session.user);
      res.send({rows});
    }
  });
})

router.get("/lifeConcierge/api/logout", (req,res)=>{
  delete req.session.user;
  res.send(req.session.user);
})

router.get('/lifeConcierge/api/userInfo', (req,res)=>{
  conn.query('select * from userinfo where isDeleted = 0', (err,rows)=>{
    if(!err) {
      res.json(rows);
    }else{
      console.log(err);
    }
  })
})

router.post('/lifeConcierge/api/userDelete', (req,res)=>{
  const email = req.body.email;
  conn.query('update userinfo set isDeleted = 1 where email = ?', [email], (err, rows)=>{
    if(err){
      console.log("에러");
    }else if(rows.length == 0) {
      console.log("아이디 없음");
    }else {
      res.send("emralr");
    }
  })
})

router.post('/lifeConcierge/api/addEvent', (req,res)=> {
  const email = req.body.email;
  const start = req.body.start;
  const end = req.body.end;
  const title = req.body.title;
  const sLocation = req.body.sLocation;
  const eLocation = req.body.eLocation;
  const content = req.body.content;
  const preAlarm = req.body.preAlarm;
  const checkSpecial = req.body.checkSpecial;
  const tag = JSON.stringify(req.body.tag);
  const tag2 = JSON.stringify(req.body.tag2);
  const cateList = JSON.stringify(req.body.cateList);
  const checkWeeks = JSON.stringify(req.body.checkWeeks);
  
  const confirm = [email, start, end, title, sLocation, eLocation, content, preAlarm,  checkSpecial, tag, tag2, cateList, checkWeeks]
  console.log(confirm)
  if(req.body.tag.tagName !== '데일리루틴') {
    const sql = "insert into specialevent values(?, ?, ?, ?, ?, ?, null, ?, ?, ?, ?, ?, ?)";
    const params = [email, start, end, title, sLocation, eLocation, content, preAlarm, checkSpecial, tag, tag2, cateList];
    conn.query(sql, params, (err, rows)=>{
      if(err){
        console.log(err);
        res.send("에러");
      } else if (rows.length == 0) {
        console.log("DB 적용 안됌");
        res.send("DB 적용 안됌");
      } else {
        res.send(rows);
      }
    })
  } else {
    const sql = "insert into dailyevent values(?, ?, ?, ?, ?, ?, null, ?, ?, ?, ?, ?, ?)";
    const params = [email, start, end, title, sLocation, eLocation, content, preAlarm, tag, tag2, cateList, checkWeeks];
    conn.query(sql, params, (err, rows)=>{
      if(err){
        console.log(err);
        res.send("에러");
      } else if (rows.length == 0) {
        console.log("DB 적용 안됌");
        res.send("DB 적용 안됌");
      } else {
        res.json(rows);
      }
    })
  }

})

router.get('/lifeConcierge/api/session', (req,res)=>{
  console.log(req.session.user);
  res.send(req.session.user);
})

router.post('/lifeConcierge/api/showDailyEvent', (req,res)=>{
  conn.query("select * from dailyevent where email = ?", [req.body.email], (err,rows)=>{
    if(err){
      res.send(err);
    } else if (rows.length==0) {
      res.send("없는 계정");
    } else {
      res.send(rows);
    }
  })
});

router.get("/test", (req,res)=>{
  conn.query("select * from test", (err,rows)=>{
    console.log(err);
    console.log(rows);
  })
})



/* 세형 */

/* 챗봇으로 성향정보 수정하기 */
router.post("/chatbotUpdate", (req, res) => {
  console.log("chatbotUpdate 라우터 진입");
  console.log("이름: " + req.body.name);
  console.log("성별: " + req.body.gender);
  console.log("나이: " + req.body.age);

  let name = req.body.name;
  let gender = req.body.gender;
  let age = req.body.age;

  let sql = `
  UPDATE sessions 
  SET start=?, 
  end=?,
  color=?
  WHERE pid="1";
  `;
  conn.query(sql, [name, gender, age], (err, rows) => {
    console.log("컨쿼리진입");
  });
});
/* 맵api라우터 */
router.post('/map', function (req, res) {    
  console.log('map라우터 진입 성공')
  /* let userInput = req.query.userInput */
  let userInput1 = req.body.userInput1 
  let userInput2 = req.body.userInput2
  console.log(`유저인풋1 : ${userInput1}, 유저인풋2 : ${userInput2}`)
  //const result = spawn("python3", ["map.py",[userInput1,userInput2]]);
  //const result = spawn("python3", ["map.py"]);
 // const result = spawn("python", ["map.py"]);
  const result = spawn("python", ["map.py",userInput1,userInput2]);
  console.log('파이썬 파일 변수 선언 성공') 
  result.stdout.on("data", (result) => {  
    console.log('stdout 진입 성공')
    console.log('result : ' + result.toString());
    console.log(`파이썬 파일 변수 선언 성공  |  유저인풋1 : ${userInput1}, 유저인풋2 : ${userInput2}`)
    res.json(result.toString())
    //res.json(result.toString().slice(0,(result.toString().length-6)))

  }) 
});
/* 맵api test라우터 */
router.get('/maptest', function (req, res) {    
  console.log('메인라우터 진입 성공')
  //일단로컬로
  res.redirect("http://127.0.0.1:5500/server/maptest.html")
});



module.exports = router;
