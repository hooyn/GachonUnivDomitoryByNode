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
        console.log("[modifyArticle] '" + curUser + "'님 제목 입력 필요" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
        responseData.check = false;
        responseData.code = 301;
        responseData.message = '제목 NOT FOUND';
        return res.json(responseData);
    }
    else if(!category){
        console.log("[modifyArticle] '" + curUser + "'님 카테고리 입력 필요" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
        responseData.check = false;
        responseData.code = 302;
        responseData.message = '카테고리 NOT FOUND';
        return res.json(responseData);
    }
    else if(!text){
        console.log("[modifyArticle] '" + curUser + "'님 내용 입력 필요" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
        responseData.check = false;
        responseData.code = 303;
        responseData.message = '내용 NOT FOUND';
        return res.json(responseData);
    }
    else if(!no){
        console.log("[modifyArticle] '" + curUser + "'님 글no 입력 필요" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
        responseData.check = false;
        responseData.code = 304;
        responseData.message = '글 no NOT FOUND';
        return res.json(responseData);
    }
    else{
        var query=connection.query('select * from articlelist where no=?', [no], function(err, rows){
            if(err) throw err;
            if(rows[0]){
                console.log("[modifyArticle] article no:" + no + " 해당 글 검색 성공" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                if(rows[0].userId==curUser){
                    if(!hash[0]&&!hash[1]&&!hash[2]){
                        var query = connection.query('update articlelist set title=?, category=?, text=? where no=?', [title, category, text, no], function(err, rows){
                            if(err) throw err;
                            console.log("[modifyArticle] '" + curUser + "'님 " + no +"번 글 수정 완료" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                            responseData.check = true;
                            responseData.code = 200;
                            responseData.message = '글 수정 완료';
                            return res.json(responseData);
                        })
                    }
                
                    else if(hash[0]&&!hash[1]&&!hash[2]){
                        var query = connection.query('update articlelist set title=?, category=?, text=?, hash_1=? where no=?', [title, category, text, hash[0], no], function(err, rows){
                            if(err) throw err;
                            console.log("[modifyArticle] '" + curUser + "'님 " + no +"번 글 수정 완료" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                            responseData.check = true;
                            responseData.code = 200;
                            responseData.message = '글 수정 완료';
                            return res.json(responseData);
                        })
                    }
                    else if(hash[0]&&hash[1]&&!hash[2]){
                        var query = connection.query('update articlelist set title=?, category=?, text=?, hash_1=?, hash_2=? where no=?', [title, category, text, hash[0], hash[1], no], function(err, rows){
                            if(err) throw err;
                            console.log("[modifyArticle] '" + curUser + "'님 " + no +"번 글 수정 완료" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                            responseData.check = true;
                            responseData.code = 200;
                            responseData.message = '글 수정 완료';
                            return res.json(responseData);
                        })
                    }
                    else{
                        var query = connection.query('update articlelist set title=?, category=?, text=?, hash_1=?, hash_2=?, hash_3=? where no=?', [title, category, text, hash[0], hash[1], hash[2], no], function(err, rows){
                            if(err) throw err;
                            console.log("[modifyArticle] '" + curUser + "'님 " + no +"번 글 수정 완료" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                            responseData.check = true;
                            responseData.code = 200;
                            responseData.message = '글 수정 완료';
                            return res.json(responseData);
                        })
                    }
                }
                else{
                    console.log("[modifyArticle] '" + curUser + "'님은 글 작성자가 아닙니다" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                    responseData.check = false;
                    responseData.code = 306;
                    responseData.message = '글 작성자 NOT EQUAL 현재 사용자';
                    return res.json(responseData);
                }
            }
            else{
                console.log("[modifyArticle] '" + curUser + "'님 해당 글no를 찾을 수 없습니다" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                responseData.check = false;
                responseData.code = 305;
                responseData.message = '글 NOT FOUND';
                return res.json(responseData);
            }
        })
    }
});


module.exports = router;

