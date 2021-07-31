const express = require('express');
var mysql = require('mysql');
var dateFormat = require('dateformat');
var router = express.Router();

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

//ACCESS ROUTER CLEANARTICLE
router.post('/', function(req, res){
  responseData = {};
  var today = new Date();
  var day = new Date(today.setDate(today.getDate() - 7));
  var date_seven_ago = dateFormat(day, "isoDate");

  connection.query('select * from articlelist where timeStamp like ?',[date_seven_ago + "%"], function(err, rows){
    if(err) throw err;
    if(rows.length){
      for(var i=0;i<rows.length;i++){
        connection.query('delete from replylist where article_no=?',[rows[i].no],function(err,rows){
          if(err) throw err;
        })
        connection.query('delete from reportlist where article_no=?',[rows[i].no],function(err,rows){
          if(err) throw err;
        })
      }
      connection.query('delete from articlelist where timeStamp like ?',[date_seven_ago + "%"],function(err,rows){
        if(err) throw err;
      })
      console.log("[cleanArticle] 7일 지난 게시글 및 관련 댓글 신고내역 삭제 완료" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
      responseData.check = true;
      responseData.code = 200;
      responseData.message = '7일 지난 게시글 및 관련 댓글 신고내역 삭제 완료';
      return res.json(responseData);  
    }
    else{
      console.log("[cleanArticle] 7일 지난 게시글 NOT FOUND" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
      responseData.check = true;
      responseData.code = 201;
      responseData.message = '7일 지난 게시글 NOT FOUND';
      return res.json(responseData);  
    }
  })
})

module.exports = router;
