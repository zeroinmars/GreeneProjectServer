const { spawn } = require("child_process");
const { EDESTADDRREQ } = require("constants");
const express = require("express");
const conn = require("../config");
const router = express.Router();

router.post("/lifeConcierge/api/signup", (req, res) => {
  const sql = "insert into userinfo values (null, ?, ?, ?, ?, ?, ?, ?, null, null, null, null, null, null, null, null, null, null, now(), 0, null);";
  const params = [req.body.email, req.body.pw, req.body.name, req.body.gender, req.body.birthday, req.body.hAddr, req.body.cAddr];

  conn.query(sql, params, (err, rows) => {
    if (err) {
      console.log("에러");
      res.json(err);
    } else if (rows.length == 0) {
      console.log("값이 없음")
      res.json(err);
    } else {
      console.log(rows);
      res.json(rows);
    }
  });
});

router.post("/lifeConcierge/api/login", (req, res) => {
  const email = req.body.email;
  const pw = req.body.pw;
  console.log(`전달받은 email : ${email}, pw : ${pw}`);
  const sql = 'select * from userinfo where email=? and pw=?';

  conn.query(sql, [email, pw], (err, rows) => {
    if (err) {
      console.log("에러 발생");
    } else if (rows.length == 0) {
      console.log('id가 없습니다.');
      res.json("NoneId");
    } else {
      req.session.user = rows[0];
      console.log(req.session.user);
      res.send({ rows });
    }
  });
});

router.get("/lifeConcierge/api/logout", (req, res) => {
  delete req.session.user;
  res.send(req.session.user);
});

router.get('/lifeConcierge/api/userInfo', (req, res) => {
  conn.query('select * from userinfo where isDeleted = 0', (err, rows) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  })
});

router.post('/lifeConcierge/api/loginUserInfo', (req, res) => {
  const email = req.body.email;
  const sql = 'SELECT name FROM userinfo WHERE email=?';
  conn.query(sql, [email], (err, row) => {
    if (err) {
      res.send(err);
    } else if (!row.length){
      console.log('유저가 없습니다');
    } else {
      res.send(row[0]);
    }
  });
});

router.post('/lifeConcierge/api/userDelete', (req, res) => {
  const email = req.body.email;
  conn.query('update userinfo set isDeleted = 1 where email = ?', [email], (err, rows) => {
    if (err) {
      console.log("에러");
    } else if (rows.length == 0) {
      console.log("아이디 없음");
    } else {
      res.send("emralr");
    }
  })
});

router.post('/lifeConcierge/api/addEvent', (req, res) => {
  const email = req.body.email;
  const start = req.body.start;
  const sTime = req.body.sTime;
  const end = req.body.end;
  const eTime = req.body.eTime;
  const title = req.body.title;
  const sLocation = req.body.sLocation;
  const eLocation = req.body.eLocation;
  const content = req.body.content;
  const preAlarm = req.body.preAlarm;
  const checkSpecial = req.body.checkSpecial;
  const tag = req.body.tag;
  const color = req.body.color;
  const cateList = JSON.stringify(req.body.cateList);
  const checkWeeks = JSON.stringify(req.body.checkWeeks);
  let moveTime = null;

  if (tag !== '데일리루틴') {
    if (sLocation && eLocation) {
      const result = spawn("python", ["map.py", sLocation, eLocation]);
      console.log('파이썬 파일 변수 선언 성공');
      result.stdout.on("data", (result) => {
        console.log('stdout 진입 성공');
        console.log('result : ' + result.toString());
        console.log(`파이썬 파일 변수 선언 성공  |  유저인풋1 : ${sLocation}, 유저인풋2 : ${eLocation}`);
        moveTime = result.toString().trim();

        const sql = `INSERT INTO specialevent(email, start, sTime, end, eTime, title, 
                sLocation, eLocation, moveTime, content, preAlarm, checkSpecial, 
                tag, color, cateList)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,	?, ?, ?, ?, ?)`;
        const params = [email, start, sTime, end, eTime, title, sLocation, eLocation, moveTime, content, preAlarm, checkSpecial, tag, color, cateList];
        conn.query(sql, params, (err, rows) => {
          if (err) {
            console.log(err);
            res.send("에러");
          } else if (rows.length == 0) {
            console.log("DB 적용 안됨");
            res.send("DB 적용 안됨");
          } else {
            res.send(rows);
          }
        });
      })
    } else {
      const sql = `INSERT INTO specialevent(email, start, sTime, end, eTime, title, 
        sLocation, eLocation, moveTime, content, preAlarm, checkSpecial, 
        tag, color, cateList)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,	?, ?, ?, ?, ?)`;
      const params = [email, start, sTime, end, eTime, title, sLocation, eLocation, moveTime, content, preAlarm, checkSpecial, tag, color, cateList];
      conn.query(sql, params, (err, rows) => {
        if (err) {
          console.log(err);
          res.send("에러");
        } else if (rows.length == 0) {
          console.log("DB 적용 안됨");
          res.send("DB 적용 안됨");
        } else {
          res.send(rows);
        }
      });
    }
  } else {
    const tagName = req.body.tag2;
    const tagColor = req.body.color2;
    if (sLocation && eLocation) {
      const result = spawn("python", ["map.py", sLocation, eLocation]);
      console.log('파이썬 파일 변수 선언 성공');
      result.stdout.on("data", (result) => {
        console.log('stdout 진입 성공');
        console.log('result : ' + result.toString());
        console.log(`파이썬 파일 변수 선언 성공  |  유저인풋1 : ${sLocation}, 유저인풋2 : ${eLocation}`);
        moveTime = result.toString().trim();

        const sql = "insert into dailyevent values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const params = [email, start, sTime, end, eTime, title, sLocation, eLocation, moveTime, content, preAlarm, tagName, tagColor, cateList, checkWeeks];

        conn.query(sql, params, (err, rows) => {
          if (err) {
            console.log(err);
            res.send("에러");
          } else if (rows.length == 0) {
            console.log("DB 적용 안됨");
            res.send("DB 적용 안됨");
          } else {
            res.json(rows);
          }
        });
      });
    } else {
      const sql = "insert into dailyevent values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const params = [email, start, sTime, end, eTime, title, sLocation, eLocation, moveTime, content, preAlarm, tagName, tagColor, cateList, checkWeeks];

      conn.query(sql, params, (err, rows) => {
        if (err) {
          console.log(err);
          res.send("에러");
        } else if (rows.length == 0) {
          console.log("DB 적용 안됨");
          res.send("DB 적용 안됨");
        } else {
          res.json(rows);
        }
      });
    }
  }

});

router.get('/lifeConcierge/api/session', (req, res) => {
  console.log(req.session.user);
  res.send(req.session.user);
});


router.post('/lifeConcierge/api/showDailyEvent', (req, res) => {
  // 이메일이랑 데일리인지 아닌지
  // if문으로 conn.query할 때 둘 중 하나
  conn.query("select * from dailyevent where email = ?", [req.body.email], (err, rows) => {
    if (err) {
      res.send(err);
    } else if (rows.length == 0) {
      res.send("없는 계정");
    } else {
      res.send(rows);
    }
  })
});

router.post('/lifeConcierge/api/showSpecialEvent', (req, res) => {
  conn.query("select * from specialEvent where email = ?", [req.body.email], (err, rows) => {
    if (err) {
      res.send(err);
    } else if (rows.length == 0) {
      res.send("없는 계정");
    } else {
      // let events = rows.map((data) => {
      //   if (data.tag) {
      //     let tempData = {...data, color: data.tag.slice(-9,-2)}
      //     return tempData
      //   }
      //   return data
      // })
      res.send(rows);
    }
  })
});

router.post('/lifeConcierge/api/deleteSpecialEvent', (req, res) => {
  const eventId = req.body.eventId;
  console.log(eventId)
  const sql = 'DELETE FROM specialevent WHERE event_id = ?';
  conn.query(sql, [eventId], (err, rows) => {
    if (err) {
      res.send(err);
    } else if (rows.length == 0) {
      console.log("DB 적용 안됨");
      res.send("DB 적용 안됨");
    } else {
      res.json(rows);
    }
  });
});

router.post('/lifeConcierge/api/UpdateEvent', (req, res) => {
  const start = req.body.start;
  const sTime = req.body.sTime;
  const end = req.body.end;
  const eTime = req.body.eTime;
  const title = req.body.title;
  const sLocation = req.body.sLocation;
  const eLocation = req.body.eLocation;
  const content = req.body.content;
  const preAlarm = req.body.preAlarm;
  const checkSpecial = req.body.checkSpecial;
  const tag = req.body.tag;
  const color = req.body.color;
  const cateList = JSON.stringify(req.body.cateList);
  const eventId = req.body.event_id;
  console.log(sLocation, eLocation, cateList);

  if (sLocation && eLocation) {
    const result = spawn("python", ["map.py", sLocation, eLocation]);
    console.log('파이썬 파일 변수 선언 성공')
    
    result.stdout.on("data", (result) => {
      console.log('stdout 진입 성공');
      console.log('result : ' + result.toString());
      console.log(`파이썬 파일 변수 선언 성공  |  유저인풋1 : ${sLocation}, 유저인풋2 : ${eLocation}`);
      const moveTime = result.toString().trim();
      const params = [start, sTime, end, eTime, title, sLocation, eLocation, moveTime,
        content, preAlarm, checkSpecial, tag, color, cateList, eventId].map(
          (data) => {
            return data ? data : null
          }
        );
  
      const sql = `update specialevent set start=?, sTime=?, end=?, eTime=?, 
                  title=?, sLocation=?, eLocation=?, moveTime=?, content=?, preAlarm=?,
                  checkSpecial=?, tag=?, color=?, cateList=?
                  where event_id=?`;
      conn.query(sql, params, (err, rows) => {
        if (err) {
          res.send(err);
        } else if (rows.length == 0) {
          console.log("DB 적용 안됨");
          res.send("DB 적용 안됨");
        } else {
          res.json(rows);
        }
      })
  
    });
  } else {
    const moveTime = null
    const params = [start, sTime, end, eTime, title, sLocation, eLocation, moveTime,
      content, preAlarm, checkSpecial, tag, color, cateList, eventId].map(
        (data) => {
          return data ? data : null
        }
      );

    const sql = `update specialevent set start=?, sTime=?, end=?, eTime=?, 
                title=?, sLocation=?, eLocation=?, moveTime=?, content=?, preAlarm=?,
                checkSpecial=?, tag=?, color=?, cateList=?
                where event_id=?`;
    conn.query(sql, params, (err, rows) => {
      if (err) {
        res.send(err);
      } else if (rows.length == 0) {
        console.log("DB 적용 안됨");
        res.send("DB 적용 안됨");
      } else {
        res.json(rows);
      }
    })
  }
}
)
router.get("/test", (req, res) => {
  conn.query("select * from test", (err, rows) => {
    console.log(err);
    console.log(rows);
  });
});




/* 세형 */

/* 챗봇으로 성향정보 수정하기 */
router.post("/chatbotUpdate", (req, res) => {
  console.log("chatbotUpdate 라우터 진입");
  console.log("wake: " + req.body.wake);
  console.log("startwork: " + req.body.startwork);
  console.log("lunch: " + req.body.lunch);
  console.log("endwork: " + req.body.endwork);
  console.log("transport: " + req.body.transport);
  console.log("job: " + req.body.job);
  console.log("hobby: " + req.body.hobby);
  console.log("music: " + req.body.music);
  console.log("food: " + req.body.food);
  console.log("drink: " + req.body.drink);
  let email = req.body.email;
  let wake = req.body.wake;
  let startwork = req.body.startwork;
  let lunch = req.body.lunch;
  let endwork = req.body.endwork;
  let transport = req.body.transport;
  let job = req.body.job;
  let hobby = req.body.hobby;
  let music = req.body.music;
  let food = req.body.food;
  let drink = req.body.drink;
  let sql = `UPDATE userinfo
  SET 
  wake=?,
  startwork=?,
  lunch=?,
  endwork=?,
  transpo=?, 
  job=?,
  hobby=?,
  music=?,
  food=?,
  drink=?
  WHERE email=?`;
  conn.query(
    sql,
    [
      wake,
      startwork,
      lunch,
      endwork,
      transport,
      job,
      hobby,
      music,
      food,
      drink,
      email
    ],
    (err, rows) => {
      console.log("컨쿼리진입");
      res.redirect("http://127.0.0.1:3000/");
    }
  );
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
  const result = spawn("python", ["map.py", userInput1, userInput2]);
  console.log('파이썬 파일 변수 선언 성공')
  result.stdout.on("data", (result) => {
    console.log('stdout 진입 성공')
    console.log('result : ' + result.toString());
    console.log(`파이썬 파일 변수 선언 성공  |  유저인풋1 : ${userInput1}, 유저인풋2 : ${userInput2}`)
    res.json(result.toString().trim())
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
