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
  const title = req.body.title;
  const start = req.body.start;
  const end = req.body.end;
  const content = req.body.content;
  const sLocation = req.body.sLocation;
  const eLocation = req.body.eLocation;
  const checkDaily = req.body.checkDaily;
  const checkWeeks = JSON.stringify(req.body.checkWeeks);
  const checkSpecial = req.body.checkSpecial;
  const preAlarm = req.body.preAlarm;

  const confirm = [email, start, end, title, content, sLocation, eLocation, checkDaily, checkWeeks, checkSpecial, preAlarm]
  console.log(confirm)
  if(checkDaily) {
    const sql = "insert into dailyevent values(?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const params = [email, start, end, title, content, sLocation, eLocation, checkWeeks, preAlarm];
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
    const sql = "insert into specialevent values(?, ?, ?, ?, ?, ?, ?, ?, ?, null)";
    const params = [email, start, end, title, content, sLocation, eLocation, checkSpecial, preAlarm];
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

module.exports = router;