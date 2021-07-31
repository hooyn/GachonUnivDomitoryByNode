 const express = require('express');
var router = express.Router();
var mysql = require('mysql');

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

//ACCESS ROUTER REPORTLIST
router.post('/', function(req, res){
    var responseData = {};
    var article_no = req.body.article_no;

    if(article_no){
        var query = connection.query('select * from reportlist where article_no=? order by report_no desc',[article_no] , function(err, rows){
            if(err) throw err;
            console.log("[reportlist] " + article_no + "번 게시물에 대한 신고내역 요청" + " [ " + dateFormat(Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT") + " ] " )
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '신고 접수 내역 업로드 완료';
            responseData.content = rows;
            return res.json(responseData);
        })
    }
    else{
        var query = connection.query('select * from reportlist order by report_no desc', function(err, rows){
            if(err) throw err;
            console.log("[reportlist] 모든 게시물에 대한 신고내역 요청" + " [ " + dateFormat(Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT") + " ] " )
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '신고 접수 내역 업로드 완료';
            responseData.content = rows;
            return res.json(responseData);
        })
    }
});

module.exports = router;