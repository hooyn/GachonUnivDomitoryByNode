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

//ACCESS ROUTER HOME
router.get('/all', function(req, res){ //모든 게시물 불러오기
    var responseData = {};
    var page = req.query.page;
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
    var query = connection.query('select * from articlelist order by timeStamp desc', function(err, rows){
                if(err) throw err;
                if(rows[0]){
                    var count = rows.length;
                    var conArr = [];
                    for(var i=(page-1)*20;i<page*20&&i<count;i++){ //페이징 처리
                        if(rows[i].category=="룸메"&&bool==false) continue;
                        var hash = []; //해시태그 데이터 처리
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
                    console.log("[home/all] 모든 게시물 목록을 요청했습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '모든 게시물 목록을 요청했습니다.';
                    responseData.content = conArr;
                    return res.json(responseData);
                }
                else{
                    var count = rows.length;
                    var conArr = [];
                    for(var i=(page-1)*20;i<page*20&&i<count;i++){ //페이징 처리
                        var hash = []; //해시태그 데이터 처리
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
                    console.log("[home/all] 모든 게시물 목록을 요청했습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '모든 게시물 목록을 요청했습니다.';
                    responseData.content = conArr;
                    return res.json(responseData);
                }
                
            })
	});

router.get('/recentPost', function(req, res){ //최근 게시물 불러오기
    var responseData = {};
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
    var query = connection.query('select * from articlelist order by timeStamp desc', function(err, rows){
                if(err) throw err;
                if(rows[0]){
                    var count = rows.length;
                    var conArr = [];
                    if(count>5){
                        for(var i=0; i<5 ; i++){ //최근 게시물은 5개로 setting
                            if(rows[i].category=="룸메"&&bool==false) continue;
                            var hash = []; //해시태그 데이터 처리
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
                    }
                    else{
                        for(var i=0; i<rows.length ; i++){ //최근 게시물은 5개로 setting
                            var hash = []; //해시태그 데이터 처리
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
                    }
                    console.log("[home/recentPost] 최근 게시물을 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '최근 게시물을 요청하였습니다.';
                    responseData.content = conArr;
                    return res.json(responseData);
                } else if(rows.length==0){
                    var conArr = [];
                    console.log("[home/recentPost] 최근 게시물을 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] ")
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '최근 게시물을 요청하였습니다.';
                    responseData.content = conArr;
                    return res.json(responseData);
                }
                else{
                    var count = rows.length;
                    var conArr = [];
                    for(var i=0; i<5 ; i++){ //최근 게시물은 5개로 setting
                        var hash = []; //해시태그 데이터 처리
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
                    console.log("[home/recentPost] 최근 게시물을 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '최근 게시물을 요청하였습니다.';
                    responseData.content = conArr;
                    return res.json(responseData);
                }
                
            })
	});

router.get('/delivery', function(req, res){ //배달 게시물 불러오기
    var responseData = {};
    var page = req.query.page;

    var query = connection.query('select * from articlelist where category="배달" order by timeStamp desc', function(err, rows){
        if(err) throw err;
        if(rows[0]){
            var count = rows.length;
            var conArr = [];
            for(var i=(page-1)*20;i<page*20&&i<count;i++){ //페이징 처리
                var hash = []; //해시태그 데이터 처리
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
            console.log("[home/delivery] 배달 게시물을 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
    )
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '배달 게시물을 요청하였습니다.';
            responseData.content = conArr;
            return res.json(responseData);
        }
        else{
            var count = rows.length;
            var conArr = [];
            for(var i=(page-1)*20;i<page*20&&i<count;i++){ //페이징 처리
                var hash = []; //해시태그 데이터 처리
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
            console.log("[home/delivery] 배달 게시물을 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
    )
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '배달 게시물을 요청하였습니다.';
            responseData.content = conArr;
            return res.json(responseData);
        }
        
    });

});

router.get('/taxi', function(req, res){ //택시 게시물 불러오기
    var responseData = {};
    var category = req.query.category;
    var page = req.query.page;
    var query = connection.query('select * from articlelist where category="택시" order by timeStamp desc', function(err, rows){
        if(err) throw err;
        if(rows[0]){
            var count = rows.length;
            var conArr = [];
            for(var i=(page-1)*20;i<page*20&&i<count;i++){
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
            console.log("[home/taxi] 택시 게시물을 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
    )
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '택시 게시물을 요청하였습니다.';
            responseData.content = conArr;
            return res.json(responseData);
        }
        else{
            var count = rows.length;
            var conArr = [];
            for(var i=(page-1)*20;i<page*20&&i<count;i++){
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
            console.log("[home/taxi] 택시 게시물을 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
    )
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '택시 게시물을 요청하였습니다.';
            responseData.content = conArr;
            return res.json(responseData);
        }
        
    });
});

router.get('/room-mate', function(req, res){
    var responseData = {};
    var page = req.query.page;
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

    if(bool==true){
        var query = connection.query('select * from articlelist where category="룸메" order by timeStamp desc', function(err, rows){
            if(err) throw err;
            if(rows[0]){
                var count = rows.length;
                var conArr = [];
                for(var i=(page-1)*20;i<page*20&&i<count;i++){
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
                console.log("[home/room-mate] 룸메 게시물을 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '룸메 게시물을 요청하였습니다.';
                responseData.content = conArr;
                return res.json(responseData);
            }
            else{
                var count = rows.length;
                var conArr = [];
                for(var i=(page-1)*20;i<page*20&&i<count;i++){
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
                console.log("[home/room-mate] 룸메 게시물을 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '룸메 게시물을 요청하였습니다.';
                responseData.content = conArr;
                return res.json(responseData);
            }
        });
    }
    else{
        console.log("[home/room-mate] 룸메 게시물 요청을 실패하였습니다. - 룸메 신청 기간이 아닙니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
        responseData.check = false;
        responseData.code = 301;
        responseData.message = '룸메이트 신청기간이 아닙니다.';
        return res.json(responseData);
    }


    
});

router.get('/parcel', function(req, res){
    var responseData = {};
    var category = req.query.category;
    var page = req.query.page;

    var query = connection.query('select * from articlelist where category="택배" order by timeStamp desc', function(err, rows){
        if(err) throw err;
        if(rows[0]){
            var count = rows.length;
            var conArr = [];
            for(var i=(page-1)*20;i<page*20&&i<count;i++){
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
            console.log("[home/parcel] 택배 게시물을 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
    )
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '택배 게시물을 요청하였습니다.';
            responseData.content = conArr;
            return res.json(responseData);
        }
        else{
            var count = rows.length;
            var conArr = [];
            for(var i=(page-1)*20;i<page*20&&i<count;i++){
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
            console.log("[home/parcel] 택배 게시물을 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
    )
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '택배 게시물을 요청하였습니다.';
            responseData.content = conArr;
            return res.json(responseData);
        }
        
        
    });
});


module.exports = router;

