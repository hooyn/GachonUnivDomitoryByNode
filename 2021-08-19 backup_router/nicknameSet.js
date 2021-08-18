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
          console.log('error when connecting to db:' + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , err);
          setTimeout(handleDisconnect, 2000); 
        }                                   
      });                                 
                                             
      connection.on('error', function(err) {
        console.log('db error' + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , err);
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
        if(err) return err;
        if(rows.length){ 
            var query = connection.query('select * from user where nickname=?', [nickname], function(err, rows){
                if(err) return res.json(err);
                if(rows[0]){
                    console.log("[nicknameSet] [" + curId + "] 사용자 [" + nickname + "] 중복되는 닉네임입니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                    responseData.check = false;
                    responseData.code = 304;
                    responseData.message = '중복되는 닉네임입니다.';
                    return res.json(responseData);
                }
                else{
                    if(nickname.length<2 ) {
                        console.log("[nicknameSet] [" + curId + "] 사용자 [" + nickname + "] 닉네임 2글자 미만으로 설정할 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                        responseData.check = false;
                        responseData.code = 301;
                        responseData.message ='닉네임을 2글자 미만으로 설정할 수 없습니다.';
                        return res.json(responseData);
                    }else if(nickname.length>8) {
                        console.log("[nicknameSet] [" + curId + "] 사용자 [" + nickname + "] 닉네임 8글자 초과로 설정할 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                        responseData.check = false;
                        responseData.code = 302;
                        responseData.message ='닉네임을 8글자 초과로 설정할 수 없습니다.';
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
                            connection.query('update notificationlist set nickname=? where curUser=?', [nickname, curId], function(err, rows){
                                if(err) throw err;
                            })
                            console.log("[nicknameSet] [" + curId + "] 사용자 [" + nickname + "] 닉네임이 데이터베이스에 저장되었습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                                responseData.check = true;
                                responseData.code = 200;
                                responseData.message = '닉네임이 데이터베이스에 저장되었습니다.';
                                return res.json(responseData);
                        })
                    }
                }
            })
        } else {
            console.log("[nicknameSet] [" + curId + "] 사용자" + " 아이디를 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
            responseData.check = false;
            responseData.code = 303;
            responseData.message = '아이디를 찾을 수 없습니다.';
            return res.json(responseData);
        }
    })

});


module.exports = router;
