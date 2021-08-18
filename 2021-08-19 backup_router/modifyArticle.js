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

//ACCESS ROUTER MODIFYARTICLE
router.post('/', function(req, res){
    var responseData = {};
    var curUser = req.body.curUser; //현재 기기에 있는 id
    var no = req.body.no;
    var title = req.body.title;
    var category = req.body.category;
    var text = req.body.text;
    var hash = req.body.hash;

  
    if(!title){
        console.log("[modifyArticle] [" + curUser + "] 사용자 게시글의 제목을 입력해주세요." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
        responseData.check = false;
        responseData.code = 301;
        responseData.message = '게시글의 제목을 입력해주세요.';
        return res.json(responseData);
    }
    else if(!category){
        console.log("[modifyArticle] [" + curUser + "] 사용자 게시글의 카테고리를 입력해주세요." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
        responseData.check = false;
        responseData.code = 302;
        responseData.message = '게시글의 카테고리를 입력해주세요.';
        return res.json(responseData);
    }
    else if(!text){
        console.log("[modifyArticle] [" + curUser + "] 사용자 게시글의 내용을 입력해주세요." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] ");
        responseData.check = false;
        responseData.code = 303;
        responseData.message = '게시글의 내용을 입력해주세요.';
        return res.json(responseData);
    }
    else if(!no){
        console.log("[modifyArticle] [" + curUser + "] 사용자 게시글의 번호을 입력해주세요." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
        responseData.check = false;
        responseData.code = 304;
        responseData.message = '게시글의 번호을 입력해주세요.';
        return res.json(responseData);
    }
    else{
        var query=connection.query('select * from articlelist where no=?', [no], function(err, rows){
            if(err) throw err;
            if(rows[0]){
                if(rows[0].userId==curUser){
                    if(!hash){
                        var query = connection.query('update articlelist set title=?, category=?, text=?, hash_1=?, hash_2=?, hash_3=? where no=?', [title, category, text, null, null, null, no], function(err, rows){
                            if(err) throw err;
                            console.log("[modifyArticle] [" + curUser + "] 사용자 [" + no + "] 번 게시글을 수정했습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
                            responseData.check = true;
                            responseData.code = 200;
                            responseData.message = '게시글이 수정되었습니다.';
                            return res.json(responseData);
                        })
                    }
                    else if(hash[0]&&!hash[1]&&!hash[2]){
                        var query = connection.query('update articlelist set title=?, category=?, text=?, hash_1=?, hash_2=?, hash_3=? where no=?', [title, category, text, hash[0], null, null, no], function(err, rows){
                            if(err) throw err;
                            console.log("[modifyArticle] [" + curUser + "] 사용자 [" + no + "] 번 게시글을 수정했습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
                            responseData.check = true;
                            responseData.code = 200;
                            responseData.message = '게시글이 수정되었습니다.';
                            return res.json(responseData);
                        })
                    }
                    else if(hash[0]&&hash[1]&&!hash[2]){
                        var query = connection.query('update articlelist set title=?, category=?, text=?, hash_1=?, hash_2=?, hash_3=? where no=?', [title, category, text, hash[0], hash[1], null, no], function(err, rows){
                            if(err) throw err;
                            console.log("[modifyArticle] [" + curUser + "] 사용자 [" + no + "] 번 게시글을 수정했습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
                            responseData.check = true;
                            responseData.code = 200;
                            responseData.message = '게시글이 수정되었습니다.';
                            return res.json(responseData);
                        })
                    }
                    else{
                        var query = connection.query('update articlelist set title=?, category=?, text=?, hash_1=?, hash_2=?, hash_3=? where no=?', [title, category, text, hash[0], hash[1], hash[2], no], function(err, rows){
                            if(err) throw err;
                            console.log("[modifyArticle] [" + curUser + "] 사용자 [" + no + "] 번 게시글을 수정했습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
                            responseData.check = true;
                            responseData.code = 200;
                            responseData.message = '게시글이 수정되었습니다.';
                            return res.json(responseData);
                        })
                    }
                }
                else{
                    console.log("[modifyArticle] [" + curUser + "] 사용자 게시글의 작성자가 아닙니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
                    responseData.check = false;
                    responseData.code = 306;
                    responseData.message = '게시글의 작성자가 아닙니다.';
                    return res.json(responseData);
                }
            }
            else{
                console.log("[modifyArticle] [" + no + "] 번 게시글을 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
                responseData.check = false;
                responseData.code = 305;
                responseData.message = '게시글을 찾을 수 없습니다.';
                return res.json(responseData);
            }
        })
    }
});


module.exports = router;

