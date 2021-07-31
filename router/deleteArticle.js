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
                      console.log("[deleteArticle]" + no + '번 글의 댓글 삭제 완료' + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    })
                    connection.query('delete from reportlist where article_no=?',[no],function(err, rows){
                      if(err) throw err;
                      console.log(no + '번 글의 댓글 리스트 삭제 완료' + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    })
                    console.log("[deleteArticle]" + no + '번 글의 신고 내역 삭제 완료' + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '글 삭제 성공';
                    return res.json(responseData);
                })
            }
            else{
                console.log("[deleteArticle] '" + curUser +"'님 " + no + "번 글의 작성자 확인 실패" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                responseData.check = false;
                responseData.code = 301;
                responseData.message = '글의 작성자 NOT EQUAL 현재 사용자';
                return res.json(responseData);
            }
        } else{
            console.log("[deleteArticle] " + no + "번 글 NOT FOUND" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
            responseData.check = false;
            responseData.code = 302;
            responseData.message = '글 no NOT FOUND';
            return res.json(responseData);
        }
    })
});


module.exports = router;
