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

//ACCESS ROUTER GETUSER
router.post('/nickname', function(req, res){
    var responseData = {};
    var id = req.body.id;
 
    var query = connection.query('select * from user where id=?',[id], function(err, rows){
        if(err) throw err;
        if(rows[0]){
            if(rows[0].nickname){
                console.log("[getUser/nickname] '" + id + "'님 닉네임 정보 전달 완료" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '유저 닉네임 정보 전달 완료';
                responseData.content = rows[0].nickname;
            } else{
                console.log("[getUser/nickname] '" + id + "'님 닉네임 설정 필요" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
                responseData.check = true;
                responseData.code = 201;
                responseData.message = '닉네임 설정 필요'; 
            }
            
        } else {
            console.log("[getUser/nickname] '" + id + "'님 아이디 확인 필요" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '아이디 확인 필요';
        }
        return res.json(responseData);
    })
});
router.post('/', function(req, res){
    var responseData = {};
    var id = req.body.id;
 
    var query = connection.query('select * from user where id=?',[id], function(err, rows_a){
        if(err) throw err;
        if(rows_a[0]){ 
            var query = connection.query('select * from articlelist where userId=?',[id], function(err, rows){
                var cnt = rows.length;
                console.log("[getUser] '" + id + "'님 정보 전달 완료" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
                rows_a[0].article_count = cnt;
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '유저 정보 전달 완료';
                responseData.content = rows_a;
                return res.json(responseData); 
            })
        } else {
            console.log("[getUser] '" + id + "'님 아이디 확인 필요" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '아이디 확인 필요';
            return res.json(responseData);
        }
        
    })
});
router.post('/nickname/delete', function(req, res){
    var responseData = {};
    var id = req.body.id;
 
    var query = connection.query('select * from user where id=?',[id], function(err, rows){
        if(err) throw err;
        if(rows[0]){
            if(rows[0].nickname){
                connection.query('update user set nickname=null where id=?', [id], function(err, rows){
                    if(err) throw err;
                    console.log("[getUser/nickname/delete] '" + id + "'님 닉네임 삭제 완료" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '유저 닉네임 정보 삭제 완료';
                    return res.json(responseData);
                })
            } else{
                console.log("[getUser/nickname/delete] '" + id + "'님 닉네임 설정 필요" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
                responseData.check = false;
                responseData.code = 302;
                responseData.message = '닉네임 설정 필요';
                return res.json(responseData);
            }
            
        } else {
            console.log("[getUser/nickname/delete] '" + id + "'님 아이디 확인 필요" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '아이디 확인 필요';
            return res.json(responseData);
        }
        
    })
});


module.exports = router;

