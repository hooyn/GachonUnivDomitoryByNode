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

//ACCESS ROUTER NOTIFICATION
router.post('/list', function(req, res){ //사용자의 알림 목록
    var responseData = {};
    var curUser = req.body.curUser;
    var page = req.query.page;

    connection.query('select * from user where id=?',[curUser],function(err, rows){
        if(err) throw err;
        if(rows[0]){
            connection.query('select * from notificationlist where userId=? order by timeStamp desc',[curUser],function(err, rows){
                if(err) throw err;
                if(rows[0]){
                    var count = rows.length;
                    var conArr = [];
                    for(var i=(page-1)*10;i<page*10&&i<count;i++){ //페이징 처리
                        var fileExists = fs.existsSync(__dirname + '/user_profile_image/' + rows[i].curUser + '.txt');
                        if(fileExists){
                          var fileRead = fs.readFileSync(__dirname + '/user_profile_image/' + rows[i].curUser + '.txt', 'utf8');
                            rows[i].imageSource = fileRead;
                          }
                        else{
                            rows[i].imageSource = null;
                        }
                        if(rows[i].check_read==true){
                            rows[i].check_read=true
                        }
                        else{
                            rows[i].check_read=false
                        }
                        conArr.push(rows[i]);
                    }
                    console.log("[notification/list] [" + curUser + "] 사용자 알림 목록을 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '알림 목록을 요청하였습니다.';
                    responseData.content = conArr;
                    return res.json(responseData);
                }
                else{
                    console.log("[notification/list] [" + curUser + '] 사용자 알림이 없습니다' + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '사용자 알림이 없습니다';
                    responseData.content = [];
                    return res.json(responseData);
                }
            })
        } else {
            console.log("[notification/list] [" + curUser + "]  아이디를 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '아이디를 찾을 수 없습니다.';
            return res.json(responseData);
        }
    })



});

router.post('/check', function(req, res){ //사용자의 알림이 있는지
    var responseData = {};
    var curUser = req.body.curUser;

    connection.query('select * from user where id=?',[curUser],function(err,rows){
        if(err) throw err;
        if(rows[0]){
            connection.query('select * from notificationlist where check_read=false and userId=?',[curUser], function(err, rows){
                if(err) throw err;
                if(rows[0]){
                    console.log("[notification/check] [" + curUser + "] 사용자 안 읽은 알림을 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '안 읽은 알림을 요청하였습니다.';
                    responseData.notificationCount = rows.length;
                    return res.json(responseData); 
                } else { 
                    console.log("[notification/check] [" + curUser + "] 사용자 안 읽은 알림이 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '안 읽은 알림이 없습니다.';
                    responseData.notificationCount = 0;
                    return res.json(responseData); 
                }
            })
        }
        else{
            console.log("[notification/check] [" + curUser + "] 사용자 아이디를 찾을 수 없습니다. " + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '아이디를 찾을 수 없습니다.';
            return res.json(responseData);
        }
    })    
});

router.post('/read', function(req, res){ //사용자의 알림을 읽음으로 표시 <클릭 시>
    var responseData = {};
    var curUser = req.body.curUser;
    var notification_no = req.body.notification_no;

    connection.query('select * from user where id=?',[curUser],function(err, rows){
        if(err) throw err;
        if(rows[0]){
            connection.query('select * from notificationlist where notification_no=?', [notification_no], function(err, rows){
                if(err) throw err;
                if(rows[0]){
                    if(rows[0].userId!=curUser){
                        console.log("[notification/read] 알림과 관계없는 사용자입니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                        responseData.check = false;
                        responseData.code = 303;
                        responseData.message = '알림과 관계없는 사용자입니다.';
                        return res.json(responseData); 
                    }
                    if(rows[0].check_read==true){
                        console.log("[notification/read] 이미 읽은 알림입니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                        responseData.check = true;
                        responseData.code = 200;
                        responseData.message = '이미 읽은 알림입니다.';
                        return res.json(responseData); 
                    }
                    connection.query('update notificationlist set check_read=true where notification_no=?',[notification_no], function(err, rows){
                        if(err) throw err;
                        console.log("[notification/read] [" + notification_no + "] 번 알림 읽음 처리를 요청했습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                        responseData.check = true;
                        responseData.code = 200;
                        responseData.message = "알림 읽음 처리를 요청했습니다.";
                        return res.json(responseData); 
                    })
                }
                else{
                    console.log("[notification/read] [" + notification_no + "] 번 알림을 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = false;
                    responseData.code = 302;
                    responseData.message = '해당 알림을 찾을 수 없습니다.';
                    return res.json(responseData);                
                }
            })
        } else {
            console.log("[notification/read] [" + curUser + "] 사용자 아이디를 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '아이디를 찾을 수 없습니다.';
            return res.json(responseData);
        }
    })
})

router.post('/read/all', function(req, res){ 
    var responseData = {};
    var curUser = req.body.curUser;

    connection.query('select * from user where id=?',[curUser],function(err, rows){
        if(err) throw err;
        if(rows[0]){
            connection.query('select * from notificationlist where userId=? and check_read=false', [curUser], function(err, rows){
                if(err) throw err;
                if(rows[0]){
                    var count = rows.length;
                    for(var i=0;i<count;i++){
                        connection.query('update notificationlist set check_read=true where notification_no=?',[rows[i].notification_no],function(err,rows){
                            if(err) throw err;
                        })
                    }
                    console.log("[notification/read/all] 모든 알림 읽기를 요청했습니다. " + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '모든 알림 읽기를 요청했습니다.';
                    return res.json(responseData);
                } else {
                    console.log("[notification/read/all] 안 읽은 알림이 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '안 읽은 알림이 없습니다.';
                    return res.json(responseData);
                } 
            })
        } else {
            console.log("[notification/read/all] [" + curUser + "] 사용자 아이디를 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '아이디를 찾을 수 없습니다.';
            return res.json(responseData);
        }
    })
})


module.exports = router;