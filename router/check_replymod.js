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

//ACCESS ROUTER CHECK_REPLYMOD
router.get('/', function(req, res){
    var responseData = {};
    var curUser = req.body.curUser;
    var reply_no = req.body.reply_no;
 
    var query = connection.query('select * from replylist where reply_no=?',[reply_no], function(err, rows_a){
        if(err) throw err;
        if(rows_a[0]){
            var query = connection.query('select * from user where id=?',[curUser],function(err, rows){
                if(rows[0]){
                    if(rows_a[0].userId==curUser){
                        console.log("[check_replymod] 사용자가 작성한 댓글 확인" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                        responseData.check = true;
                        responseData.code = 200;
                        responseData.message = '사용자가 작성한 댓글이 맞습니다.';
                        return res.json(responseData);
                    } else {
                      console.log("[check_replymod] 사용자가 작성한 댓글 확인X" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                        responseData.check = false;
                        responseData.code = 303;
                        responseData.message = '사용자가 작성한 댓글이 아닙니다.';
                        return res.json(responseData);
                    }
                }
                else{
                  console.log("[check_replymod] 아이디 NOT FOUND" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = false;
                    responseData.code = 301;
                    responseData.message = '아이디가 일치하지 않습니다.';
                    return res.json(responseData);
                }
            })
        }
        else{
          console.log("[check_replymod] 댓글 NOT FOUND" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
            responseData.check = false;
            responseData.code = 302;
            responseData.message = '해당 댓글이 존재하지 않습니다.';
            return res.json(responseData);
        }
        
    })
});


module.exports = router;

