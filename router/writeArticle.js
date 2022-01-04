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

//ACCESS ROUTER WRITEARTICLE
router.post('/', function(req, res){
    var responseData = {};
    var title = req.body.title;
    var category = req.body.category;
    var userId = req.body.userId;
    var userNickname;
    var text = req.body.text;
    var hash = req.body.hash;

    var today = dateFormat(Date(),'yyyy-mm-dd');
    var startday = dateFormat(Date(),'2021-08-01');
    var endday = dateFormat(Date(),'2021-08-02');
    var bool;

    if(today>startday && today<endday){
        bool=true;
    }
    else{
        bool=false;
    }

    var query = connection.query('select * from user where id=?', [userId], function(err, rows){
        if(err) throw err;
        if(rows[0]){ // user DB ID 사용자 인증 성공
            console.log("[writeArticle] [" + userId + "] 사용자 아이디가 인증되었습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
            userNickname = rows[0].nickname;
            var sql = 'insert into articlelist (title, category, userId, userNickname, token, text, hash_1, hash_2, hash_3) values (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            if(!userNickname){
                console.log("[writeArticle]  [" + userId + "] 사용자 닉네임을 설정해주세요." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
                responseData.check = false;
                responseData.code = 305;
                responseData.message = '닉네임을 설정해주세요.';
                return res.json(responseData);
            }
            else if(!title){
                console.log("[writeArticle] [" + userId + "] 사용자 게시글의 제목을 입력해주세요." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
                responseData.check = false;
                responseData.code = 301;
                responseData.message = '게시글의 제목을 입력해주세요.';
                return res.json(responseData);
            }

            else if(!category){
                console.log("[writeArticle] [" + userId + "] 사용자 게시글의 카테고리를 입력해주세요." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
                responseData.check = false;
                responseData.code = 302;
                responseData.message = '게시글의 카테고리를 입력해주세요.';
                return res.json(responseData);
            }
            else if(!text){
                console.log("[writeArticle] [" + userId + "] 사용자 게시글의 내용을 입력해주세요." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
                responseData.check = false;
                responseData.code = 303;
                responseData.message = '게시글의 내용을 입력해주세요.';
                return res.json(responseData);
            }
            else if(bool==false&&category=="룸메"){
                console.log("[writeArticle] [" + userId + "] 사용자 룸메 신청 기간이 아닙니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
                responseData.check = false;
                responseData.code = 305;
                responseData.message = '룸메 신청 기간이 아닙니다.';
                return res.json(responseData);
            }
            else if(!hash || (!hash[0]&&!hash[1]&&!hash[2])){ //해시태그 없을 때
                var query = connection.query('insert into articlelist (title, category, userId, userNickname, token, text) values (?, ?, ?, ?, ?, ?)', [title, category, userId, userNickname, rows[0].token, text], function(err, rows){
                    if(err) throw err;
                    console.log("[writeArticle] [" + userId + "] 사용자 게시글이 저장되었습니다. [tag0]" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '게시글이 저장되었습니다.';
                    return res.json(responseData);
                })
            }
            else if(hash[0]&&!hash[1]&&!hash[2]){ //해시태그가 하나일 때
                var query = connection.query('insert into articlelist (title, category, userId, userNickname, token, text, hash_1) values (?, ?, ?, ?, ?, ?, ?)', [title, category,userId, userNickname, rows[0].token, text, hash[0]], function(err, rows){
                    if(err) throw err;
                    console.log("[writeArticle] [" + userId + "] 사용자 게시글이 저장되었습니다. [tag1]" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '게시글이 저장되었습니다.';
                    return res.json(responseData);
                })
            }
            else if(hash[0]&&hash[1]&&!hash[2]){ //해시태그가 두개일 때
                var query = connection.query('insert into articlelist (title, category,userId, userNickname, token, text, hash_1, hash_2) values (?, ?, ?, ?, ?, ?, ?, ?)', [title, category, userId, userNickname, rows[0].token, text, hash[0], hash[1]], function(err, rows){
                    if(err) throw err;
                    console.log("[writeArticle] [" + userId + "] 사용자 게시글이 저장되었습니다. [tag2]" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '게시글이 저장되었습니다.';
                    return res.json(responseData);
                })
            }
            else{ //해시태그가 세개일 때
                var query = connection.query(sql, [title, category, userId, userNickname, rows[0].token, text, hash[0], hash[1], hash[2]], function(err, rows){
                    if(err) throw err;
                    console.log("[writeArticle] [" + userId + "] 사용자 게시글이 저장되었습니다. [tag3]" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '게시글이 저장되었습니다.';
                    return res.json(responseData);
                })
            }
        }
        else{ // user DB ID 사용자 확인 실패
            console.log("[writeArticle]  [" + userId + "] 사용자 아이디를 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
            responseData.check = false;
            responseData.code = 304;
            responseData.message = '아이디를 찾을 수 없습니다.';
            return res.json(responseData);
        }
    })
    
});


module.exports = router;

