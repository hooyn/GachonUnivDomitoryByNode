const express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dateFormat = require('dateformat');
const { profile } = require('console');
var fs = require('fs'); 

//DATABASE SETTING
var teamsbDB = {
    host : **',
    port : 3306,
    user : 'root',
    password : '**',
    database : '**',
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
                                             
      connection.on('error' + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , function(err) {
        console.error('db error', err);
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
    var profile_image = req.body.profile_image;

    var query = connection.query('select * from user where id=?', [curId], function(err, rows){
        if(err) throw err;
        if(rows.length){ 
            if(!profile_image){
                console.log("[profileSet] [" + curId + "] 사용자 " + "프로필 이미지 설정이 필요합니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
                responseData.check = false;
                responseData.code = 302;
                responseData.message = '프로필 이미지 설정이 필요합니다.';
                return res.json(responseData);
            } 
            fs.exists(__dirname + '/user_profile_image/' + curId + '.txt', function (exists) { 
                if(exists){
                  fs.readFile(__dirname + '/user_profile_image/' + curId + '.txt', 'utf8', function(err, data) { 
                    if(err) throw err;
                      fs.writeFile(__dirname + '/user_profile_image/' + curId + '.txt', profile_image, 'utf8', function(error){ 
                        if(error) throw error;
                        console.log("[profileSet] [" + curId + "] 사용자" + " 프로필 이미지가 저장되었습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
                        responseData.check = true;
                        responseData.code = 200;
                        responseData.message = '프로필 이미지가 저장되었습니다.';
                        return res.json(responseData);
                    });
                  })
                }
                else{
                  console.log("[profileSet] [" + curId + "] 사용자" + " 프로필 이미지 파일을 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
                  responseData.check = false;
                  responseData.code = 304;
                  responseData.message = '프로필 이미지 파일을 찾을 수 없습니다.';
                  return res.json(responseData);
                }
            });
        } else {
            console.log("[profileSet] [" + curId + "]" + " 사용자 아이디를 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '아이디를 찾을 수 없습니다.';
            return res.json(responseData);
        }
    })

});

router.post('/delete', function(req, res){
    var responseData = {};
    var curId = req.body.curId;

    var query = connection.query('select * from user where id=?', [curId], function(err, rows){
        if(err) throw err;
        if(rows.length){  
            fs.exists(__dirname + '/user_profile_image/' + curId + '.txt', function (exists) { 
                if(exists){
                  fs.readFile(__dirname + '/user_profile_image/' + curId + '.txt', 'utf8', function(err, data) { 
                    if(err) throw err;
                      fs.writeFile(__dirname + '/user_profile_image/' + curId + '.txt', "", 'utf8', function(error){ 
                        if(error) throw error;
                        console.log("[profileSet/delete] [" + curId + "] 사용자" + " 프로필 이미지를 삭제하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
                        responseData.check = true;
                        responseData.code = 200;
                        responseData.message = '프로필 이미지가 삭제되었습니다.';
                        return res.json(responseData);
                    });
                  })
                }
                else{
                  console.log("[profileSet/delete] [" + curId + "] 사용자" + " 프로필 이미지 파일을 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
                  responseData.check = false;
                  responseData.code = 304;
                  responseData.message = '프로필 이미지 파일을 찾을 수 없습니다.';
                  return res.json(responseData);
                }
            });
        } else {
            console.log("[profileSet/delete] [" + curId + "] 사용자" + " 아이디를 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '아이디를 찾을 수 없습니다.';
            return res.json(responseData);
        }
    })

});


module.exports = router;
