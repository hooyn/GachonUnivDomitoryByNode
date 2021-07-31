const express = require('express');
var router = express.Router();
var mysql = require('mysql');
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

//ACCESS ROUTER NICKNAMESET
router.post('/', function(req, res){
    var responseData = {};
    var curId = req.body.curId;
    var nickname = req.body.nickname;

    var query = connection.query('select * from user where id=?', [curId], function(err, rows){
        if(err) return done(err);
        if(rows.length){ 
            var query = connection.query('select * from user where nickname=?', [nickname], function(err, rows){
                if(err) return done(err);
                if(rows.length){
                    console.log("[nicknameSet] '" + curId + "'" + "님 '" + nickname + "' 중복" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                    responseData.check = false;
                    responseData.code = 304;
                    responseData.message = '닉네임 중복';
                    return res.json(responseData);
                }
                else{
                    if(nickname.length<2 ) {
                        console.log("[nicknameSet] '" + curId + "'" + "님 '" + nickname + "' 닉네임 2글자 미만 설정 제한" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                        responseData.check = false;
                        responseData.code = 301;
                        responseData.message ='2글자 미만 닉네임 설정 불가';
                        return res.json(responseData);
                    }else if(nickname.length>8) {
                        console.log("[nicknameSet] '" + curId + "'" + "님 '" + nickname + "' 닉네임 8글자 초과 설정 제한" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                        responseData.check = false;
                        responseData.code = 302;
                        responseData.message ='8글자 초과 닉네임을 설정 불가';
                        return res.json(responseData);
                    } else {
                        var query = connection.query('update user set nickname=? where id=?', [nickname, curId], function(err, rows){
                            if(err) throw err
                            connection.query('update articlelist set userNickname=? where userId=?', [nickname, curId], function(err, rows){
                                if(err) throw err;
                            })
                            connection.query('update replylist set userNickname=? where userId=?', [nickname, curId], function(err, rows){
                                if(err) throw err;
                            })
                            console.log("[nicknameSet] '" + curId + "'" + "님 '" + nickname + "' 닉네임 userDB에 저장" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                                responseData.check = true;
                                responseData.code = 200;
                                responseData.message = '닉네임 저장';
                                return res.json(responseData);
                        })
                    }
                }
            })
        } else {
            console.log("[nicknameSet] '" + curId + "'" + " 아이디 NOT FOUND" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
            responseData.check = false;
            responseData.code = 303;
            responseData.message = '아이디 NOT FOUND';
            return res.json(responseData);
        }
    })

});


module.exports = router;
