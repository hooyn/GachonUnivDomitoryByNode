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

//ACCESS ROUTER ACCESSARTICLE
router.post('/', function(req, res){
    var responseData = {};
    var no = req.body.no;
    var count;
    var query = connection.query('select * from articlelist where no=?',[no],function(err, rows){
        if(err) throw err;
        if(rows[0]){
            count = rows[0].viewCount + 1;
            var query = connection.query('update articlelist set viewCount=? where no=?', [count, no], function(err, rows){
                if(err) throw err;
                console.log("[accessArticle] '" + no + "'번 글의 조회수가 증가 성공" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '조회수가 증가 완료';
                return res.json(responseData);
            })
        }
        else{
            console.log("[accessArticle] '" + no + "'번 글 NOT FOUND" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '글 NOT FOUND';
            return res.json(responseData);
        }
    })
});

router.post('/detail', function(req, res){
    var responseData = {};
    var no = req.body.no;
    var query = connection.query('select * from articlelist where no=?',[no],function(err, rows){
        if(err) throw err;
        if(rows[0]){
            var conArr = [];
            var hash = []; //해시태그 데이터 처리
            if(rows[0].hash_1){
                hash.push(rows[0].hash_1)
                if(rows[0].hash_2){
                    hash.push(rows[0].hash_2)
                    if(rows[0].hash_3){
                        hash.push(rows[0].hash_3)
                    }
                }
            }
            rows[0].hash = hash;
            delete rows[0].hash_1;
            delete rows[0].hash_2;
            delete rows[0].hash_3;
            conArr.push(rows[0]);
            
            console.log("[accessArticle/detail] '" + no + "'번 글의 상세내용 전달 성공" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '글 상세내용 불러오기 성공';
            responseData.content = conArr;
            return res.json(responseData);
        }
        else{
            console.log("[accessArticle/detail] '" + no + "'번 글 NOT FOUND" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '글 NOT FOUND';
            return res.json(responseData);
        }
    })
});

router.post('/getViewCount', function(req, res){
    var responseData = {};
    var no = req.body.no;
    var query = connection.query('select * from articlelist where no=?',[no],function(err, rows){
        if(err) throw err;
        if(rows[0]){
            console.log("[accessArticle/getViewCount] '" + no + "'번 글 조회수 요청 성공" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
            var conArr = [];
            var hash = [];
            if(rows[0].hash_1){
                hash.push(rows[0].hash_1)
                if(rows[0].hash_2){
                    hash.push(rows[0].hash_2)
                    if(rows[0].hash_3){
                        hash.push(rows[0].hash_3)
                    }
                }
            }
            rows[0].hash = hash;
            delete rows[0].hash_1;
            delete rows[0].hash_2;
            delete rows[0].hash_3;
            conArr.push(rows[0]);
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '글의 조회수 불러오기 성공';
            responseData.content = conArr;
            return res.json(responseData);
        }
        else{
            console.log("[accessArticle/getViewCount] '" + no + "'번 글 NOT FOUND" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '글 NOT FOUND';
            return res.json(responseData);
        }
    })
});

module.exports = router;

