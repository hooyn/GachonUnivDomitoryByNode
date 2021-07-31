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

//ACCESS ROUTER SEARCH
router.post('/', function(req, res){
    var responseData = {};
    var category = req.body.category;
    var keyword = req.body.keyword;
    var page = req.query.page;

    if(!keyword&&category){
        var query = connection.query('select * from articlelist where category=? order by timeStamp desc', [category] , function(err, rows){
            if(err) throw err;
            if(rows){
                var count = rows.length;
                var conArr = [];
                for(var i=(page-1)*10;i<page*10&&i<count;i++){
                    var hash = [];
                    if(rows[i].hash_1){
                        hash.push(rows[i].hash_1)
                        if(rows[i].hash_2){
                            hash.push(rows[i].hash_2)
                            if(rows[i].hash_3){
                                hash.push(rows[i].hash_3)
                            }
                        }
                    }
                    rows[i].hash = hash;
                    delete rows[i].hash_1;
                    delete rows[i].hash_2;
                    delete rows[i].hash_3;
                    conArr.push(rows[i]);
                }
                console.log("[search] 카테고리에 따른 검색 성공" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '카테고리에 따른 검색 완료';
                responseData.content = conArr;
                return res.json(responseData);
            }
        })
    }
    else if(keyword&&category){
        var query = connection.query('select * from (select * from articlelist where category=?) as article where text like ? or title like ? order by timeStamp desc;', [category, '%' + keyword + '%', '%' + keyword + '%'] , function(err, rows){
            if(err) throw err;
            if(rows){
                var count = rows.length;
                var conArr = [];
                for(var i=(page-1)*10;i<page*10&&i<count;i++){
                    var hash = [];
                    if(rows[i].hash_1){
                        hash.push(rows[i].hash_1)
                        if(rows[i].hash_2){
                            hash.push(rows[i].hash_2)
                            if(rows[i].hash_3){
                                hash.push(rows[i].hash_3)
                            }
                        }
                    }
                    rows[i].hash = hash;
                    delete rows[i].hash_1;
                    delete rows[i].hash_2;
                    delete rows[i].hash_3;
                    conArr.push(rows[i]);
                }
                console.log("[search] 카테고리 및 키워드에 따른 검색 성공" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '제목, 카테고리, 내용에 따른 검색 완료';
                responseData.content = conArr;
                return res.json(responseData);
            }
        })
    }
    else if(keyword&&!category){
        var query = connection.query('select * from articlelist where title like ? or text like ? order by timeStamp desc', ['%' + keyword + '%', '%' + keyword + '%'] , function(err, rows){
            if(err) throw err;
            if(rows){
                var count = rows.length;
                var conArr = [];
                for(var i=(page-1)*10;i<page*10&&i<count;i++){
                    var hash = [];
                    if(rows[i].hash_1){
                        hash.push(rows[i].hash_1)
                        if(rows[i].hash_2){
                            hash.push(rows[i].hash_2)
                            if(rows[i].hash_3){
                                hash.push(rows[i].hash_3)
                            }
                        }
                    }
                    rows[i].hash = hash;
                    delete rows[i].hash_1;
                    delete rows[i].hash_2;
                    delete rows[i].hash_3;
                    conArr.push(rows[i]);
                }
                console.log("[search] 키워드에 따른 검색 성공" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '제목, 내용에 따른 검색 완료';
                responseData.content = conArr;
                return res.json(responseData);
            }
        })
    }
    else{
        console.log("[search] 검색 실패(카테고리, 키워드 미입력)" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
        responseData.check = false;
        responseData.code = 301;
        responseData.message = '검색 실패';
        return res.json(responseData);
    }
});


module.exports = router;

