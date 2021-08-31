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

//ACCESS ROUTER NICKNAMECHECK
router.post('/', function(req, res){
    var responseData = {};
    var nickname = req.body.nickname;
 
    var query = connection.query('select * from user where nickname=?',[nickname], function(err, rows){
        //nickname이 userDB에 있는지 확인하는 query
        if(err) throw err;
        if(rows[0]){
            console.log("[nicknameCheck] [" + nickname + "] 중복되는 닉네임입니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '중복되는 닉네임입니다.';
        } else {
            console.log("[nicknameCheck] [" + nickname + "] 사용가능한 닉네임입니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '사용가능한 닉네임입니다.';
        }
        return res.json(responseData);
    })
});


module.exports = router;
