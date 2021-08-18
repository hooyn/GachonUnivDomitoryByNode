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
    var no = req.body.no;
 
    var query = connection.query('select * from articlelist where no=?',[no], function(err, rows_a){
        if(err) throw err;
        if(rows_a[0]){
            var query = connection.query('select * from user where id=?',[curUser],function(err, rows){
                if(rows[0]){
                    if(rows_a[0].userId==curUser){
                        console.log("[check_mod] 사용자가 작성한 글이 맞습니다" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                        responseData.check = true;
                        responseData.code = 200;
                        responseData.message = '사용자가 작성한 글이 맞습니다.';
                        return res.json(responseData);
                    } else {
                        console.log("[check_mod] 사용자가 작성한 글이 아닙니다" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
                        responseData.check = false;
                        responseData.code = 303;
                        responseData.message = '사용자가 작성한 글이 아닙니다';
                        return res.json(responseData);
                    }
                }
                else{
                    console.log("[check_mod] [" + curUser + "] 아이디를 찾을 수 없습니다" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
                    responseData.check = false;
                    responseData.code = 301;
                    responseData.message = '아이디를 찾을 수 없습니다.';
                    return res.json(responseData);
                }
            })
        }
        else{
            console.log("[check_mod] [" + no + "]번 글을 찾을 수 없습니다" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
            responseData.check = false;
            responseData.code = 302;
            responseData.message = '해당 글을 찾을 수 없습니다.';
            return res.json(responseData);
        }
        
    })
});


module.exports = router;

