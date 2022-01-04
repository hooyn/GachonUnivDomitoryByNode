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

//ACCESS ROUTER DELETEARTICLE
router.post('/', function(req, res){
    var responseData = {};
    var curUser = req.body.curUser;
    var no = req.body.no;

    
    var query=connection.query('select * from articlelist where no=?', [no], function(err, rows){
        if(err) throw err;
        if(rows.length){
            if(rows[0].userId==curUser){
                var sql = 'delete from articlelist where no=?';
                var query = connection.query(sql, [no], function(err, rows){
                    if(err) throw err;
                    connection.query('delete from replylist where article_no=?',[no],function(err,rows){
                      if(err) throw err;
                      console.log("[deleteArticle] [" + no + '] 번 글과 관련된 댓글을 삭제하였습니다.' + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    })
                    connection.query('delete from reportlist where article_no=?',[no],function(err, rows){
                      if(err) throw err;
                      console.log("[deleteArticle] [" + no + ']번 글과 관련된 신고 내역을 삭제하였습니다.' + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    })
                    connection.query('delete from notificationlist where article_no=?',[no],function(err, rows){
                      if(err) throw err;
                      console.log("[deleteArticle] [" + no + ']번 글과 관련된 알림 내역을 삭제하였습니다.' + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    })
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '글과 관련 댓글, 신고 내역을 삭제하였습니다.';
                    return res.json(responseData);
                })
            }
            else{
                console.log("[deleteArticle] [" + curUser +"] 사용자 [" + no + "] 번 글의 작성자가 아닙니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                responseData.check = false;
                responseData.code = 301;
                responseData.message = '해당 글의 작성자가 아닙니다.';
                return res.json(responseData);
            }
        } else{
            console.log("[deleteArticle] [" + no + "] 번 글을 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
            responseData.check = false;
            responseData.code = 302;
            responseData.message = '해당 글을 찾을 수 없습니다.';
            return res.json(responseData);
        }
    })
});


module.exports = router;
