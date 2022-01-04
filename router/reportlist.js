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

//ACCESS ROUTER REPORTLIST
router.post('/', function(req, res){
    var responseData = {};
    var article_no = req.body.article_no;

    if(article_no){
        var query = connection.query('select * from reportlist where article_no=? order by report_no desc',[article_no] , function(err, rows){
            if(err) throw err;
            console.log("[reportlist] [" + article_no + "] 번 게시글의 신고내역을 요청하였습니다." + " [ " + dateFormat(Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT") + " ] " )
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '해당 글의 신고내역을 요청하였습니다.';
            responseData.content = rows;
            return res.json(responseData);
        })
    }
    else{
        var query = connection.query('select * from reportlist order by report_no desc', function(err, rows){
            if(err) throw err;
            console.log("[reportlist] 모든 게시글의 신고내역을 요청하였습니다." + " [ " + dateFormat(Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT") + " ] " )
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '모든 게시글의 신고내역을 요청하였습니다.';
            responseData.content = rows;
            return res.json(responseData);
        })
    }
});

module.exports = router;
