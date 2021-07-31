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

//ACCESS ROUTER REPLY
router.post('/write', function(req, res){
    var responseData = {};
    var article_no = req.body.article_no;
    var content = req.body.content;
    var curUser = req.body.curUser;
    var nickname;

    var query = connection.query('select * from user where id=?',[curUser],function(err, rows_u){
        if(err) throw err;
        if(rows_u[0]){
            nickname = rows_u[0].nickname;
            var query = connection.query('select * from articlelist where no=?',[article_no], function(err, rows){
                if(err) throw err;
                if(rows[0]){
                    var query = connection.query('insert into replylist(article_no, content, userId, userNickname) values (?, ?, ?, ?)',[article_no, content, curUser, nickname], function(err, rows){
                        if(err) throw err;
                        console.log("[reply/write] '" + curUser + "'님 댓글이 등록 완료" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
                        responseData.check = true;
                        responseData.code = 200;
                        responseData.message = '댓글 등록 완료';
                        return res.json(responseData);
                    })
                }
                else{
                    console.log("[reply/write] '" + article_no + "'번 글 NOT FOUND" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
                    responseData.check = false;
                    responseData.code = 302;
                    responseData.message = '글 no NOT FOUND';
                    return res.json(responseData);
                }
            })
        }
        else{
            console.log("[reply/write] '" + curUser + "'님 아이디 확인 필요" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '아이디 확인 필요';
            return res.json(responseData);
        }
    })
});

router.post('/modify', function(req, res){
    var responseData = {};
    var reply_no = req.body.reply_no;
    var content = req.body.content;
    var curUser = req.body.curUser;
    var userId;

    var query = connection.query('select * from replylist where reply_no=?',[reply_no],function(err, rows_r){
        if(err) throw err;
        if(rows_r){
            if(!content){
                console.log("[reply/modify] 댓글 입력 필요" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
                responseData.check = false;
                responseData.code = 303
                responseData.message = '댓글 내용 입력 필요';
                return res.json(responseData);
            }
            userId = rows_r[0].userId;
            if(userId==curUser){
                var query = connection.query('update replylist set content=? where reply_no=?', [content, reply_no], function(err, rows){
                    if(err) throw err;
                    console.log("[reply/modify] '" + curUser + "'님 댓글이 수정 완료" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '댓글 수정 완료';
                    return res.json(responseData);
                })
            }
            else{
                console.log("[reply/modify] '" + curUser + "'님 댓글 작성자 NOT EQUAL" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
                responseData.check = false;
                responseData.code = 302;
                responseData.message = '댓글 작성자 NOT EQUAL 현재 사용자';
                return res.json(responseData);
            }
        }
        else{
            console.log("[reply/modify] '" + reply_no + "'번 댓글 NOT FOUND" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '댓글 no NOT FOUND';
            return res.json(responseData);
        }

    })
    
});

router.post('/delete', function(req, res){
    var responseData = {};
    var curUser = req.body.curUser;
    var reply_no = req.body.reply_no;


    var query=connection.query('select * from replylist where reply_no=?', [reply_no], function(err, rows){
        if(err) throw err;
        if(rows[0]){
            if(rows[0].userId==curUser){
                var sql = 'delete from replylist where reply_no=?';
                var query = connection.query(sql, [reply_no], function(err, rows){
                    if(err) throw err;
                    console.log("[reply/delete] '" + reply_no + "'번 댓글 삭제 완료" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '댓글 삭제 완료';
                    return res.json(responseData);
                })    
            }
            else{
                console.log("[reply/delete] '" + curUser + "'님 댓글 작성자 NOT EQUAL" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
                responseData.check = false;
                responseData.code = 301;
                responseData.message = '댓글 작성자 NOT EQUAL 현재 사용자';
                return res.json(responseData);
            }
        }
        else{
            console.log("[reply/delete] '" + reply_no + "'번 댓글 NOT FOUND" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
            responseData.check = false;
            responseData.code = 302;
            responseData.message = '댓글 no NOT FOUND';
            return res.json(responseData);
        }
    })
});

router.post('/list', function(req, res){
    var responseData = {};
    var curUser = req.body.curUser;
    var article_no = req.body.article_no;
    var page = req.query.page;

    var query = connection.query('select * from user where id=?',[curUser],function(err,rows){
        if(err) throw err;
        if(rows[0]){
            var query = connection.query('select * from replylist where article_no=?',[article_no], function(err, rows){
                if(err) throw err;
                var count = rows.length;
                var conArr = [];
                for(var i=(page-1)*20;i<page*20&&i<count;i++){
                    if(rows[i].userId==curUser){
                        rows[i].right=true;
                    }
                    else{
                        rows[i].right=false;
                    }
                    conArr.push(rows[i]);
                }
                console.log("[reply/list] '" + article_no + "'번 글의 댓글 요청" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '댓글 불러오기 성공';
                responseData.content = conArr;
                return res.json(responseData);
                
            })
        }
        else{
            console.log("[reply/list] '" + curUser + "'님 아이디 확인 필요" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '아이디 확인 필요';
            return res.json(responseData);
        }
    })



});

    module.exports = router; 


    