const express = require('express');
var router = express.Router();
var mysql = require('mysql');
var request = require("request");
var dateFormat = require('dateformat');

//DATABASE SETTING
var teamsbDB = {
    host : '13.209.10.30',
    port : 3306,
    user : 'root',
    password : 'owner9809~',
    database : 'teamsb',
    dateStrings : 'date'
  };
  var connection
  function handleDisconnect() {
      connection = mysql.createConnection(teamsbDB); 
      connection.connect(function(err) {            
        if(err) {                            
          console.log('error when connecting to db:', err);
          setTimeout(handleDisconnect, 2000); 
        }                                   
      });                                 
                                             
      connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
          return handleDisconnect();                      
        } else {                                    
          throw err;                              
        }
      });
    }
  
handleDisconnect();

//ROUTER ACCESS LOGIN
router.post('/', function(req, res){
    var userId = req.body.userId;
    var password = req.body.password;
    request({ // gachon 대학교 서버 통신 [로그인]
        uri: 'http://smart.gachon.ac.kr:8080/WebJSON', 
        method: 'post', 
        body:{
            fsp_cmd:'login',
            DVIC_ID:'dwFraM1pVhl6mMn4npgL2dtZw7pZxw2lo2uqpm1yuMs=',
            fsp_action:'UserAction',
            USER_ID:userId,
            PWD:password,
            APPS_ID:'com.sz.Atwee.gachon'
        },
        json: true
    }, 
        function(error, _response, body) {
            var result = {};
            if(body.ErrorCode=="0"){ //학교 서버 통신 성공
                console.log("[login] '" + userId + "'" + "님 가천대학교 로그인 서버 통신 성공" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                var query = connection.query('select * from user where id=?',[userId],function(err,rows){
                    if(err) throw err;
                    if(rows[0]&&rows[0].certified==true&&rows[0].nickname){ //학교 서버 통신 성공, ID정보 확인, nickname정보 확인
                        console.log("[login] '" + rows[0].id + "'" + "님 로그인 성공" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                        result.check=true;
                        result.code=200;
                        result.nickname=true;
                        result.message="로그인 성공";
                        return res.json(result);
                    }
                    else if(rows[0]&&rows[0].certified==true&&!rows[0].nickname){ //학교 서버 통신 성공, ID정보 확인, nickname정보 확인X
                        console.log("[login]'" + rows[0].id + "'" + "님 ID 정보 확인, 닉네임 설정 필요" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                        result.check=true;
                        result.code=202;
                        result.nickname=false;
                        result.message="닉네임 설정 필요";
                        return res.json(result);
                    }
                    else{ //학교 서버 통신 성공, ID정보 확인X, nickname정보 확인X >> ID정보 DB에 저장
                        connection.query('insert into user(id, user_no, certified) values(?, ?, ?);',[body.ds_output.userId,  body.ds_output.userUniqNo, true], function(err, rows){
                            if(err) throw err;
                            console.log("[login] '" + body.ds_output.userId + "'" + "님 'user' 데이터베이스에 저장" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                            result.check=true;
                            result.code=201;
                            result.nickname=false;
                            result.message="학교 인증 성공 & 유저 정보 DB 추가 & 닉네임 설정 필요"
                            result.userName = body.ds_output.userNm;
                            result.userNo = body.ds_output.userUniqNo;
                            result.userId = body.ds_output.userId;
                            result.email = body.ds_output.eml;
                            result.telNo = body.ds_output.telNo;
                            result.dept = body.ds_output.clubList.clubNm;
                            return res.json(result);
                        })
                    }
                })
            }
            else{ //학교 서버 통신 실패
                console.log("[login] '" + userId + "'" + "님 가천대학교 로그인 서버 통신 실패" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                result.check=false;
                result.code=301;
                result.message="아이디 또는 비밀번호가 일치하지 않습니다.";
                return res.json(result);
            }
        } 
    );
});

module.exports = router;