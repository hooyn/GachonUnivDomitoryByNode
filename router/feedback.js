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

//ACCESS ROUTER FEEDBACK
router.post('/', function(req, res){
    var responseData = {};
    var curUser = req.body.curUser;
    var text = req.body.text;

    connection.query('select * from user where id=?',[curUser], function(err, rows){
        if(err) throw err;
        if(rows[0]){
            if(!text){
                console.log("[feedback] 피드백 내용을 입력해주세요." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                responseData.check = false;
                responseData.code = 302;
                responseData.message = '피드백 내용을 입력해주세요';
                return res.json(responseData);
            } else {
                connection.query('insert into feedbacklist(userId, text) values(?, ?)', [curUser, text], function(err, rows){
                    if(err) throw err;
                    console.log("[feedback] [" + curUser + "] 사용자 피드백이 저장되었습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '피드백이 저장되었습니다.';
                    return res.json(responseData);
                })
            }
        } else {
            console.log("[feedback] [" + curUser + "] 사용자 아이디를 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '아이디를 찾을 수 없습니다.';
            return res.json(responseData);
        }
    })
});

router.get('/list', function(req, res){
    var responseData = {};
    
    connection.query('select * from feedbacklist order by timeStamp desc',function(err, rows){
        if(err) throw err;
        console.log("[feedback/list] 피드백 목록을 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
        responseData.check = true;
        responseData.code = 200;
        responseData.message = '피드백 목록을 요청하였습니다.';
        responseData.content = rows
        return res.json(responseData);
    })

    
});


module.exports = router;

