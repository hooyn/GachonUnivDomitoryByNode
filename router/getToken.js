const express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dateFormat = require('dateformat');

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
        console.error('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); 
      }                                   
    });                                 
                                           
    connection.on('error', function(err) {
      console.error('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
        return handleDisconnect();                      
      } else {                                    
        throw err;                              
      }
    });
  }
  
handleDisconnect();

//ACCESS ROUTER GETTOKEN 
router.post('/', function(req, res){
    var responseData = {};
    var curUser = req.body.curUser;
    var token = req.body.token;
    var isAndroid = req.body.isAndroid;
        connection.query('select * from user where id=?',[curUser],function(err,rows){
            if(err) throw err;
            if(rows[0]){
              if(isAndroid=='true'){
                connection.query('update user set isAndroid=true where id=?',[curUser],function(err, rows){
                  if(err) throw err;
                  console.log("[getToken] [" + curUser + "] 사용자 isAndroid[true] 갱신되었습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] ")
                })
              } else {
                connection.query('update user set isAndroid=false where id=?',[curUser],function(err, rows){
                  if(err) throw err;
                  console.log("[getToken] [" + curUser + "] 사용자 isAndroid[false] 갱신되었습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] ")
                })
              }
                if(rows[0].token==token){
                    console.log("[getToken] [" + curUser + "] 사용자 토큰 확인이 완료되었습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] ")
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '사용자 토큰 확인이 완료되었습니다.';
                    return res.json(responseData);
                } else {
                    connection.query('update user set token=? where id=?',[token,curUser],function(err,rows){
                        if(err) throw err;
                        connection.query('update articlelist set token=? where userId=?',[token,curUser],function(err,rows){
                          if(err) throw err;
                        })
                        connection.query('update replylist set token=? where userId=?',[token, curUser],function(err,rows){
                          if(err) throw err;
                        })
                        console.log("[getToken] [" + curUser + "] 사용자 토큰 데이터베이스에 저장되었습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] ")
                        responseData.check = true;
                        responseData.code = 200;
                        responseData.message = ' 사용자 토큰 데이터베이스에 저장되었습니다.';
                        return res.json(responseData);
                    })
                }                
            } else {
                console.log("[getToken] [" + curUser + "] 사용자 아이디를 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] ")
                responseData.check = false;
                responseData.code = 301;
                responseData.message = '아이디를 찾을 수 없습니다.';
                return res.json(responseData);
            }
        })
    });

router.post('/check', function(req, res){
  var responseData = {};
  var curUser = req.body.curUser;
  
  connection.query('select token from user where id=?',[curUser],function(err,rows){
      if(err) throw err;
      if(rows[0].token==null||rows[0].token==""){
        console.log("[getToken/check] [" + curUser + "] 사용자 토큰이 확인되었습니다.." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] ")
        responseData.check = true;
        responseData.code = 200;
        responseData.message = '사용자 토큰이 확인되었습니다.';
        responseData.tokenCheck = false;
        return res.json(responseData);
      } else {
        console.log("[getToken/check] [" + curUser + "] 사용자 토큰이 확인되었습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] ")
        responseData.check = true;
        responseData.code = 200;
        responseData.message = '사용자 토큰이 확인되었습니다.';
        responseData.tokenCheck = true;
        return res.json(responseData);
      }
      
  })
});

router.post('/my', function(req, res){
    var responseData = {};
    var curUser = req.body.curUser;
    
    connection.query('select token from user where id=?',[curUser],function(err,rows){
        if(err) throw err;
        responseData.check = true;
        responseData.code = 200;
        responseData.message = '사용자 토큰 확인이 완료되었습니다.';
        responseData.token = rows[0].token;
        return res.json(responseData);
    })
    
    });


module.exports = router;
