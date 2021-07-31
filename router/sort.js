const express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
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

router.post('/articlelist', function(req, res){
    var responseData = {};
    var count;
    connection.query('ALTER TABLE articlelist AUTO_INCREMENT=1;', function(err, rows){
        if(err) throw err;
    })
    connection.query('SET @COUNT = 0;', function(err, rows){
        if(err) throw err;
    })
    connection.query('UPDATE articlelist SET no = @COUNT:=@COUNT+1;', function(err, rows){
        if(err) throw err;
    })
    connection.query('select no from articlelist;', function(err, rows){
        if(err) throw err;
        count=rows.length;
        connection.query('ALTER TABLE articlelist AUTO_INCREMENT=?', [count], function(err, rows){
            if(err) throw err;
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '글의 고유 아이디 번호가 정렬되었습니다.';
            return res.json(responseData);
        })
    })
});
router.post('/user', function(req, res){
    var responseData = {};
    connection.query('ALTER TABLE user  AUTO_INCREMENT=1;', function(err, rows){
        if(err) throw err;
    })
    connection.query('SET @COUNT = 0;', function(err, rows){
        if(err) throw err;
    })
    connection.query('UPDATE user SET no = @COUNT:=@COUNT+1;', function(err, rows){
        if(err) throw err;
        })
    connection.query('select no from user;', function(err, rows){
        if(err) throw err;
        count=rows.length;
        connection.query('ALTER TABLE user AUTO_INCREMENT=?', [count], function(err, rows){
            if(err) throw err;
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '유저 고유 아이디 번호가 정렬되었습니다.';
            return res.json(responseData);
        })
    })
});
router.post('/replylist', function(req, res){
    var responseData = {};
    connection.query('ALTER TABLE replylist  AUTO_INCREMENT=1;', function(err, rows){
        if(err) throw err;
    })
    connection.query('SET @COUNT = 0;', function(err, rows){
        if(err) throw err;
    })
    connection.query('UPDATE replylist SET reply_no = @COUNT:=@COUNT+1;', function(err, rows){
        if(err) throw err;
        })
    connection.query('select reply_no from replylist;', function(err, rows){
        if(err) throw err;
        count=rows.length;
        connection.query('ALTER TABLE replylist AUTO_INCREMENT=?', [count], function(err, rows){
            if(err) throw err;
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '댓글 고유 번호가 정렬되었습니다.';
            return res.json(responseData);
        })
    })
});
router.post('/reportlist', function(req, res){
    var responseData = {};
    connection.query('ALTER TABLE reportlist  AUTO_INCREMENT=1;', function(err, rows){
        if(err) throw err;
    })
    connection.query('SET @COUNT = 0;', function(err, rows){
        if(err) throw err;
    })
    connection.query('UPDATE reportlist SET report_no = @COUNT:=@COUNT+1;', function(err, rows){
        if(err) throw err;
        })
    connection.query('select report_no from reportlist;', function(err, rows){
        if(err) throw err;
        count=rows.length;
        connection.query('ALTER TABLE reportlist AUTO_INCREMENT=?', [count], function(err, rows){
            if(err) throw err;
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '신고내역 고유 번호가 정렬되었습니다.';
            return res.json(responseData);
        })
    })
});



module.exports = router;
