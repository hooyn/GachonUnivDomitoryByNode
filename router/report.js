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

//ACCESS ROUTER REPORT
router.post('/', function(req, res){
    var responseData = {};
    var curUser = req.body.curUser;
    var article_no = req.body.article_no;
    var content = req.body.content;
    var count;

    var query = connection.query('select * from user where id=?',[curUser],function(err, rows_c){
        if(err) throw err;
        if(rows_c[0]){
            var query = connection.query('select * from articlelist where no=?',[article_no],function(err, rows_a){
                if(err) throw err;
                if(rows_a[0]){
                    count = rows_a[0].reportCount + 1;
                    var query = connection.query('select * from reportlist where article_no=? and userId=?',[article_no, curUser],function(err, rows){
                        if(err) throw err;
                        if(rows[0]){
                            console.log("[report] '" + curUser + "'님 '" + article_no + "'번 글 이미 신고 완료" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
                            responseData.check = false;
                            responseData.code = 303;
                            responseData.message = '이미 신고가 완료되었습니다.';
                            return res.json(responseData);
                        }
                        else{
                            var query = connection.query('insert into reportlist(article_no, content, userId) values (?, ?, ?)', [article_no, content, curUser], function(err, rows){
                                if(err) throw err;
                                connection.query('update articlelist set reportCount=? where no=?',[count, article_no], function(err, rows){
                                    if(err) throw err;
                                })
                                if(count>=5){
                                    connection.query('select * from articlelist where no=?',[article_no],function(err, rows){
                                        if(err) throw err;
                                        if(rows[0]){
                                            connection.query('insert into articlelist_trash select * from articlelist where no=?',[article_no],function(err, rows){
                                                if(err) throw err;
                                            })
                                            connection.query('delete from articlelist where no=?',[article_no],function(err, rows){
                                                if(err) throw err;
                                            })
                                            console.log("[report] '" + curUser + "'님 '" + article_no + "'번 글 신고 완료 & 게시글 5번 이상 신고되어 처리" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
                                            responseData.check = true;
                                            responseData.code = 200;
                                            responseData.message = '해당 글의 신고가 완료되었습니다.';
                                            return res.json(responseData);
                                        }
                                        else{
                                            console.log("[report] '" + curUser + "'님 '" + article_no + "'번 글 신고 완료 & 게시글 5번 이상 신고되어 처리" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
                                            responseData.check = true;
                                            responseData.code = 200;
                                            responseData.message = '해당 글의 신고가 완료되었습니다.';
                                            return res.json(responseData);
                                        }
                                    })
                                }
                                else{
                                    console.log("[report] '" + curUser + "'님 '" + article_no + "'번 글 신고 완료" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
                                    responseData.check = true;
                                    responseData.code = 200;
                                    responseData.message = '해당 글의 신고가 완료되었습니다.';
                                    return res.json(responseData);
                                }
                            })
                        }
                    })
                }
                else{
                    console.log("[report] '" + article_no + "'번 글 NOT FOUND" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
                    responseData.check = false;
                    responseData.code = 302;
                    responseData.message = '글 no NOT FOUND';
                    return res.json(responseData);
                }
            })
        }
        else{
            console.log("[report] '" + curUser + "'님 아이디 확인 필요" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '아이디 확인 필요';
            return res.json(responseData);
        }
    })
});

module.exports = router;

