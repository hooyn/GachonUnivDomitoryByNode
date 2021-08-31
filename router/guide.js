const express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var dateFormat = require('dateformat');
var path = require('path');

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

//ACCESS GUIDE
router.post('/write', function(req, res){
    var responseData = {};
    var title = req.body.title;
    var content = req.body.content;

    if(!title){
        console.log("[guide/write] 기숙사 이용 가이드의 제목을 입력해주세요 " + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] ");
        responseData.check = false;
        responseData.code = 301;
        responseData.message = '기숙사 이용 가이드의 제목을 입력해주세요';
        return res.json(responseData);
    }
    else if(!content){
        console.log("[guide/write] 기숙사 이용 가이드의 내용을 입력해주세요 " + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] ");
        responseData.check = false;
        responseData.code = 302;
        responseData.message = '기숙사 이용 가이드의 내용을 입력해주세요';
        return res.json(responseData);
    } else{
        connection.query('insert into guidelist(title, content) values(?, ?)',[title, content],function(err, rows){
            if(err) throw err;
            console.log("[guide/write] 기숙사 이용 가이드가 저장되었습니다. " + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] ");
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '기숙사 이용 가이드가 저장되었습니다.';
            return res.json(responseData);
        })
    }
});

router.get('/list', function(req, res){
    var responseData = {};

    connection.query('select * from guidelist',function(err, rows){
        if(err) throw err;
        if(rows[0]){
            console.log("[guide/list] 기숙사 이용 가이드 목록을 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] ");
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '기숙사 이용 가이드 목록을 요청하였습니다.';
            responseData.content = rows;
            return res.json(responseData);
        } else {
            console.log("[guide/list] 기숙사 이용 가이드 목록을 요청하였습니다.[empty] " + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] ");
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '기숙사 이용 가이드 목록을 요청하였습니다.[empty]';
            responseData.content = [];
            return res.json(responseData);
        }
    })
});

router.post('/access', function(req, res){
    var responseData = {};
    var guide_no = req.body.guide_no;

    connection.query('select * from guidelist where guide_no=?',[guide_no],function(err, rows){
        if(err) throw err;
        if(!guide_no){
            console.log("[guide/access] 이용 가이드의 글 번호를 입력해주세요 " + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] ");
            responseData.check = false;
            responseData.code = 302;
            responseData.message = '이용 가이드의 글 번호를 입력해주세요';
            return res.json(responseData);
        }
        if(rows[0]){
            console.log("[guide/access] [" + guide_no + "] 번 이용 가이드에 접근하였습니다. " + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] ");
            responseData.check = true;
            responseData.code = 200;
            responseData.message = "해당 이용 가이드에 접근하였습니다. ";
            responseData.content = rows[0];
            return res.json(responseData);
        } else {
            console.log("[guide/access] 해당 번호의 이용 가이드를 찾을 수 없습니다 " + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] ");
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '해당 이용 가이드를 찾을 수 없습니다';
            return res.json(responseData);
        }
    })
});

module.exports = router;
