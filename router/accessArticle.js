const express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dateFormat = require('dateformat');
var fs = require('fs');

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

//ACCESS ROUTER ACCESSARTICLE
router.post('/', function(req, res){
    var responseData = {};
    var no = req.body.no;
    var count;
    var query = connection.query('select * from articlelist where no=?',[no],function(err, rows){
        if(err) throw err;
        if(rows[0]){
            count = rows[0].viewCount + 1; //조회수 증가
            var query = connection.query('update articlelist set viewCount=? where no=?', [count, no], function(err, rows){
                if(err) throw err;
                console.log("[accessArticle] [" + no + "] 번 글에 접근을 하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '글에 접근을 하였습니다.';
                return res.json(responseData);
            })
        }
        else{
            console.log("[accessArticle] [" + no + "] 번 글을 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '해당 글을 찾을 수 없습니다.';
            return res.json(responseData);
        }
    })
});

router.post('/detail', function(req, res){
    var responseData = {};
    var no = req.body.no;
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
    var query = connection.query('select * from articlelist where no=?',[no],function(err, rows){
        if(err) throw err;
        if(rows[0].category=="룸메"&&bool==false){
            console.log("[accessArticle/detail] [" + no + "] 번 글 룸메 신청기간이 아닙니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );            
            responseData.check = false;
            responseData.code = 302;
            responseData.message = '룸메 신청기간이 아닙니다.';
            return res.json(responseData);
        }
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
            var fileExists = fs.existsSync(__dirname + '/user_profile_image/' + rows[0].userId + '.txt');
            if(fileExists){
              var fileRead = fs.readFileSync(__dirname + '/user_profile_image/' + rows[0].userId + '.txt', 'utf8');
                rows[0].imageSource = fileRead;
              }
            else{
                rows[0].imageSource = null;
            }
            conArr.push(rows[0]);
            
            console.log("[accessArticle/detail] [" + no + "] 번 글의 상세내용을 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '글의 상세내용을 요청하였습니다.';
            responseData.content = conArr;
            return res.json(responseData);
        }
        else{
            console.log("[accessArticle/detail] [" + no + "] 번 글을 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '해당 글을 찾을 수 없습니다.';
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
            console.log("[accessArticle/getViewCount] [" + no + "] 번 글의 조회수를 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
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
            responseData.message = '글의 조회수를 요청하였습니다.';
            responseData.content = conArr;
            return res.json(responseData);
        }
        else{
            console.log("[accessArticle/getViewCount] [" + no + "] 번 글을 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
);
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '해당 글을 찾을 수 없습니다.';
            return res.json(responseData);
        }
    })
});

module.exports = router;

