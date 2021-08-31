const express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dateFormat = require('dateformat');
var fs = require('fs'); 
var Blob = require('blob');

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
          console.error('error when connecting to db:' + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , err);
          setTimeout(handleDisconnect, 2000); 
        }                                   
      });                                 
                                             
      connection.on('error', function(err) {
        console.error('db error' + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , err);
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
                console.log("[getUser/nickname] [" + id + "] 사용자 닉네임 정보를 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '닉네임 정보를 요청하였습니다.';
                responseData.content = rows[0].nickname;
            } else{
                console.log("[getUser/nickname] [" + id + "] 사용자 닉네임을 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                responseData.check = true;
                responseData.code = 201;
                responseData.message = '닉네임을 찾을 수 없습니다.'; 
            }
            
        } else {
            console.log("[getUser/nickname] [" + id + "] 사용자 아이디를 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '아이디를 찾을 수 없습니다.';
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
                console.log("[getUser] [" + id + "] 사용자 정보를 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                rows_a[0].article_count = cnt;
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '사용자 정보를 요청하였습니다.';
                responseData.content = rows_a;
                return res.json(responseData); 
            })
        } else {
            console.log("[getUser] [" + id + "] 사용자 아이디를 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '아이디를 찾을 수 없습니다.';
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
                    console.log("[getUser/nickname/delete] [" + id + "] 사용자 닉네임을 삭제하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '사용자 닉네임을 삭제하였습니다.';
                    return res.json(responseData);
                })
            } else{
                console.log("[getUser/nickname/delete] [" + id + "] 사용자 닉네임을 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                responseData.check = false;
                responseData.code = 302;
                responseData.message = '닉네임을 찾을 수 없습니다.';
                return res.json(responseData);
            }
            
        } else {
            console.log("[getUser/nickname/delete] [" + id + "] 사용자 아이디를 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '아이디를 찾을 수 없습니다.';
            return res.json(responseData);
        }
        
    })
});
router.post('/profile_image', function(req, res){
    var responseData = {};
    var curId = req.body.curId;

    fs.exists(__dirname + '/user_profile_image/' + curId + '.txt', function (exists) { 
        if(exists){
          fs.readFile(__dirname + '/user_profile_image/' + curId + '.txt', 'utf8', function(err, data) { 
            if(err) throw err;
            console.log("[getUser/profile_image] [" + curId + "] 사용자 프로필 이미지를 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '사용자 프로필 이미지를 요청하였습니다.';
            responseData.content = data;
            return res.json(responseData);
          })
        }
        else{
          console.log("[getUser/profile_image] [" + curId + "]" + " 사용자 프로필 이미지 파일을 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
          responseData.check = false;
          responseData.code = 301;
          responseData.message = '프로필 이미지 파일을 찾을 수 없습니다.';
          return res.json(responseData);
        }
    });

})


module.exports = router;

