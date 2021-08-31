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
                    var fileExists = fs.existsSync(__dirname + '/user_profile_image/' + rows[i].userId + '.txt');
                    if(fileExists){
                      var fileRead = fs.readFileSync(__dirname + '/user_profile_image/' + rows[i].userId + '.txt', 'utf8');
                        rows[i].imageSource = fileRead;
                      }
                    else{
                        rows[i].imageSource = null;
                    }
                    conArr.push(rows[i]);
                }
                console.log("[search] 카테고리에 따른 검색을 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '카테고리에 따른 검색이 완료되었습니다.';
                responseData.content = conArr;
                return res.json(responseData);
            }
        })
    }
    else if(keyword&&category){
        var query = connection.query('select * from (select * from articlelist where category=?) as article where text like ? or title like ? or hash_1 like ? or hash_2 like ? or hash_3 like ?  order by timeStamp desc;', [category, '%' + keyword + '%', '%' + keyword + '%', '%' + keyword + '%', '%' + keyword + '%', '%' + keyword + '%'] , function(err, rows){
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
                    var fileExists = fs.existsSync(__dirname + '/user_profile_image/' + rows[i].userId + '.txt');
                    if(fileExists){
                      var fileRead = fs.readFileSync(__dirname + '/user_profile_image/' + rows[i].userId + '.txt', 'utf8');
                        rows[i].imageSource = fileRead;
                      }
                    else{
                        rows[i].imageSource = null;
                    }
                    conArr.push(rows[i]);
                }
                console.log("[search] 카테고리 및 키워드에 따른 검색을 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '제목, 카테고리, 내용에 따른 검색을 완료되었습니다.';
                responseData.content = conArr;
                return res.json(responseData);
            }
        })
    }
    else if(keyword&&!category){
        var query = connection.query('select * from articlelist where title like ? or text like ? or hash_1 like ? or hash_2 like ? or hash_3 like ? order by timeStamp desc', ['%' + keyword + '%', '%' + keyword + '%', '%' + keyword + '%', '%' + keyword + '%', '%' + keyword + '%'] , function(err, rows){
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
                    var fileExists = fs.existsSync(__dirname + '/user_profile_image/' + rows[i].userId + '.txt');
                    if(fileExists){
                      var fileRead = fs.readFileSync(__dirname + '/user_profile_image/' + rows[i].userId + '.txt', 'utf8');
                        rows[i].imageSource = fileRead;
                      }
                    else{
                        rows[i].imageSource = null;
                    }
                    conArr.push(rows[i]);
                }
                console.log("[search] 키워드에 따른 검색을 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '제목, 내용에 따른 검색을 완료되었습니다.';
                responseData.content = conArr;
                return res.json(responseData);
            }
        })
    }
    else{
        console.log("[search] 카테고리, 키워드를 입력해주세요." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
        responseData.check = false;
        responseData.code = 301;
        responseData.message = '카테고리, 키워드를 입력해주세요.';
        return res.json(responseData);
    }
});


module.exports = router;

