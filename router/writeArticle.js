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

//ACCESS ROUTER WRITEARTICLE
router.post('/', function(req, res){
    var responseData = {};
    var title = req.body.title;
    var category = req.body.category;
    var userId = req.body.userId;
    var userNickname;
    var text = req.body.text;
    var hash = req.body.hash;

    var query = connection.query('select * from user where id=?', [userId], function(err, rows){
        if(err) throw err;
        if(rows[0]){ // user DB ID 사용자 인증 성공
            console.log("[writeArticle] '" + userId + "'님 사용자 아이디 인증 성공" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
            userNickname = rows[0].nickname;
            var sql = 'insert into articlelist (title, category, userId, userNickname, text, hash_1, hash_2, hash_3) values (?, ?, ?, ?, ?, ?, ?, ?)';
            if(!userNickname){
                console.log("[writeArticle] '" + userId + "'님 닉네임 설정 필요" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                responseData.check = false;
                responseData.code = 305;
                responseData.message = '닉네임이 설정 필요';
                return res.json(responseData);
            }
            else if(!title){
                console.log("[writeArticle] '" + userId + "'님 제목 입력 필요" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                responseData.check = false;
                responseData.code = 301;
                responseData.message = '제목 NOT FOUND';
                return res.json(responseData);
            }

            else if(!category){
                console.log("[writeArticle] '" + userId + "'님 카테고리 입력 필요" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                responseData.check = false;
                responseData.code = 302;
                responseData.message = '카테고리 NOT FOUND';
                return res.json(responseData);
            }
            else if(!text){
                console.log("[writeArticle] '" + userId + "'님 내용 입력 필요" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                responseData.check = false;
                responseData.code = 303;
                responseData.message = '내용 NOT FOUND';
                return res.json(responseData);
            }
            else if(!hash){ //해시태그 없을 때
                var query = connection.query('insert into articlelist (title, category, userId, userNickname, text) values (?, ?, ?, ?, ?)', [title, category, userId, userNickname, text], function(err, rows){
                    if(err) throw err;
                    console.log("[writeArticle] '" + userId + "'님 글 저장 완료" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '글 저장 완료';
                    return res.json(responseData);
                })
            }
        
            else if(hash[0]&&!hash[1]&&!hash[2]){ //해시태그가 하나일 때
                var query = connection.query('insert into articlelist (title, category, userId, userNickname, text, hash_1) values (?, ?, ?, ?, ?, ?)', [title, category,userId, userNickname, text, hash[0]], function(err, rows){
                    if(err) throw err;
                    console.log("[writeArticle] '" + userId + "'님 글 저장 완료" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '글 저장 완료';
                    return res.json(responseData);
                })
            }
            else if(hash[0]&&hash[1]&&!hash[2]){ //해시태그가 두개일 때
                var query = connection.query('insert into articlelist (title, category,userId, userNickname, text, hash_1, hash_2) values (?, ?, ?, ?, ?, ?, ?)', [title, category, userId, userNickname, text, hash[0], hash[1]], function(err, rows){
                    if(err) throw err;
                    console.log("[writeArticle] '" + userId + "'님 글 저장 완료" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '글 저장 완료';
                    return res.json(responseData);
                })
            }
            else{ //해시태그가 세개일 때
                var query = connection.query(sql, [title, category, userId, userNickname, text, hash[0], hash[1], hash[2]], function(err, rows){
                    if(err) throw err;
                    console.log("[writeArticle] '" + userId + "'님 글 저장 완료" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '글 저장 완료';
                    return res.json(responseData);
                })
            }
        }
        else{ // user DB ID 사용자 확인 실패
            console.log("[writeArticle] '" + userId + "'님 사용자 아이디 인증 실패" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
            responseData.check = false;
            responseData.code = 304;
            responseData.message = '사용자 NOT FOUND';
            return res.json(responseData);
        }
    })
    
});


module.exports = router;

