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

//ACCESS ROUTER CHECK_MOD
router.post('/', function(req, res){
    var responseData = {};
    var curUser = req.body.curUser;

    connection.query('select * from user where id=?',[curUser],function(err, rows){
        if(err) throw err;
        if(rows[0]){
            connection.query('update user set token=null where id=?',[curUser],function(err, rows){
                if(err) throw err;
                console.log("[delete/token] [" + curUser + "] 사용자 토큰 정보를 삭제하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '사용자 토큰 정보를 삭제하였습니다.';
                return res.json(responseData);
            })

        } else {
            console.log("[delete/token] [" + curUser + "] 사용자 아이디를 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '아이디를 찾을 수 없습니다.';
            return res.json(responseData);
        }
    })
});


module.exports = router;

