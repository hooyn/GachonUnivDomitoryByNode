const express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dateFormat = require('dateformat');
const admin = require('firebase-admin')

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

//ACCESS ROUTER CHECK_REPLYMOD
router.post('/write', function(req, res){
    var responseData = {};
    var title = req.body.title;
    var content = req.body.content;
    var fixTop = req.body.fixTop;

    connection.query('select * from user', function(err,rows){
        if(err) throw err;
        var user_tokens_aos = [];
        var user_tokens_ios = [];
        var user_id=[];
        for(var i=0;i<rows.length;i++){
            if(rows[i].token==null){
                continue;
            } else {
                if(rows[i].isAndroid==true){
                    user_tokens_aos.push(rows[i].token);
                    user_id.push(rows[i].id)
                } else {
                    user_tokens_ios.push(rows[i].token);
                    user_id.push(rows[i].id)
                }
            }
        }
        if(!title){
            console.log("[notice/write] 공지사항의 제목을 입력해주세요." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '공지사항의 제목을 입력해주세요.';
            return res.json(responseData);
        }
        else if(!content){
            console.log("[notice/write] 공지사항의 내용을 입력해주세요." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
            responseData.check = false;
            responseData.code = 302;
            responseData.message = '공지사항의 내용을 입력해주세요.';
            return res.json(responseData);
        }
        else if(fixTop){
            connection.query('insert into noticelist(title, content, fixTop) values(?, ?, ?)',[title, content, fixTop],function(err,rows){
                if(err) throw err;
                if(user_tokens_aos!=""&&user_tokens_ios==""){ //안드로이드만 fcm 알림
                    //------------aos
                    let message_aos = {
                        tokens: user_tokens_aos,
                        android: {
                        },
                        data: {
                            title: '기숙사 공지사항을 확인해 주세요',
                            body: title
                        }
                    }
                    admin
                    .messaging()
                    .sendMulticast(message_aos)
                    .then(function (response) {
                        console.log("[firebase/push_send] Successfully sent message" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , response);
                    })
                    .catch(function (err) {
                        console.log("[firebase/push_send] Error Sending message" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , err);
                    })
                    console.log("[notice/write] 공지사항이 저장되었습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '공지사항이 저장되었습니다.';
                    return res.json(responseData);
                } else if(user_tokens_aos==""&&user_tokens_ios!=""){ //ios만 fcm 알림
                    //------------ios
                    let message_ios = {
                        tokens: user_tokens_ios,
                        notification: {
                            title: '기숙사 공지사항을 확인해 주세요',
                            body: title
                        },
                        android:{
                        },
                        apns: {
                        headers:{
                            "apns-collapse-id": '기숙사 공지사항을 확인해 주세요',
                            "content-available": "1",
                            "apns-priority": "10",
                            },
                        payload:{
                            aps:{
                                sound: 'default',
                                badge: 0
                            }
                            }
                        },
                        data: {
                            title: '기숙사 공지사항을 확인해 주세요',
                            body: title
                        }
                    }
                    admin
                    .messaging()
                    .sendMulticast(message_ios)
                    .then(function (response) {
                        console.log("[firebase/push_send] Successfully sent message" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , response);
                    })
                    .catch(function (err) {
                        console.log("[firebase/push_send] Error Sending message" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , err);
                    })
                    console.log("[notice/write] 공지사항이 저장되었습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '공지사항이 저장되었습니다.';
                    return res.json(responseData);
                } else if(user_tokens_aos!=""&&user_tokens_ios!=""){ //안드로이드, ios 둘다 fcm 알림
                    //------------aos
                    let message_aos = {
                        tokens: user_tokens_aos,
                        android: {
                        },
                        data: {
                            title: '기숙사 공지사항을 확인해 주세요',
                            body: title
                        }
                    }
                    admin
                    .messaging()
                    .sendMulticast(message_aos)
                    .then(function (response) {
                        console.log("[firebase/push_send] Successfully sent message" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , response);
                    })
                    .catch(function (err) {
                        console.log("[firebase/push_send] Error Sending message" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , err);
                    })
                    //------------ios
                    let message_ios = {
                        tokens: user_tokens_ios,
                        notification: {
                            title: '기숙사 공지사항을 확인해 주세요',
                            body: title
                        },
                        android:{
                        },
                        apns: {
                        headers:{
                            "apns-collapse-id": '기숙사 공지사항을 확인해 주세요',
                            "content-available": "1",
                            "apns-priority": "10",
                            },
                        payload:{
                            aps:{
                                sound: 'default',
                                badge: 0
                            }
                            }
                        },
                        data: {
                            title: '기숙사 공지사항을 확인해 주세요',
                            body: title
                        }
                    }
                    admin
                    .messaging()
                    .sendMulticast(message_ios)
                    .then(function (response) {
                        console.log("[firebase/push_send] Successfully sent message" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , response);
                    })
                    .catch(function (err) {
                        console.log("[firebase/push_send] Error Sending message" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , err);
                    })
                    console.log("[notice/write] 공지사항이 저장되었습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '공지사항이 저장되었습니다.';
                    return res.json(responseData);
                } else { //fcm 알림 없음
                    console.log("[notice/write] 공지사항이 저장되었습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '공지사항이 저장되었습니다.';
                    return res.json(responseData);
                }
            })
        }
        else{ //fixtop 설정 X
            connection.query('insert into noticelist(title, content) values(?, ?)',[title, content],function(err,rows){
                if(err) throw err;
                if(user_tokens_aos!=""&&user_tokens_ios==""){ //안드로이드만 fcm 알림
                    //------------aos
                    let message_aos = {
                        tokens: user_tokens_aos,
                        android: {
                        },
                        data: {
                            title: '기숙사 공지사항을 확인해 주세요',
                            body: title
                        }
                    }
                    admin
                    .messaging()
                    .sendMulticast(message_aos)
                    .then(function (response) {
                        console.log("[firebase/push_send] Successfully sent message" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , response);
                    })
                    .catch(function (err) {
                        console.log("[firebase/push_send] Error Sending message" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , err);
                    })
                    console.log("[notice/write] 공지사항이 저장되었습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '공지사항이 저장되었습니다.';
                    return res.json(responseData);
                } else if(user_tokens_aos==""&&user_tokens_ios!=""){ //ios만 fcm 알림
                    //------------ios
                    let message_ios = {
                        tokens: user_tokens_ios,
                        notification: {
                            title: '기숙사 공지사항을 확인해 주세요',
                            body: title
                        },
                        android:{
                        },
                        apns: {
                        headers:{
                            "apns-collapse-id": '기숙사 공지사항을 확인해 주세요',
                            "content-available": "1",
                            "apns-priority": "10",
                            },
                        payload:{
                            aps:{
                                sound: 'default',
                                badge: 0
                            }
                            }
                        },
                        data: {
                            title: '기숙사 공지사항을 확인해 주세요',
                            body: title
                        }
                    }
                    admin
                    .messaging()
                    .sendMulticast(message_ios)
                    .then(function (response) {
                        console.log("[firebase/push_send] Successfully sent message" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , response);
                    })
                    .catch(function (err) {
                        console.log("[firebase/push_send] Error Sending message" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , err);
                    })
                    console.log("[notice/write] 공지사항이 저장되었습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '공지사항이 저장되었습니다.';
                    return res.json(responseData);
                } else if(user_tokens_aos!=""&&user_tokens_ios!=""){ //안드로이드, ios 둘다 fcm 알림
                    //------------aos
                    let message_aos = {
                        tokens: user_tokens_aos,
                        android: {
                        },
                        data: {
                            title: '기숙사 공지사항을 확인해 주세요',
                            body: title
                        }
                    }
                    admin
                    .messaging()
                    .sendMulticast(message_aos)
                    .then(function (response) {
                        console.log("[firebase/push_send] Successfully sent message" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , response);
                    })
                    .catch(function (err) {
                        console.log("[firebase/push_send] Error Sending message" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , err);
                    })
                    //------------ios
                    let message_ios = {
                        tokens: user_tokens_ios,
                        notification: {
                            title: '기숙사 공지사항을 확인해 주세요',
                            body: title
                        },
                        android:{
                        },
                        apns: {
                        headers:{
                            "apns-collapse-id": '기숙사 공지사항을 확인해 주세요',
                            "content-available": "1",
                            "apns-priority": "10",
                            },
                        payload:{
                            aps:{
                                sound: 'default',
                                badge: 0
                            }
                            }
                        },
                        data: {
                            title: '기숙사 공지사항을 확인해 주세요',
                            body: title
                        }
                    }
                    admin
                    .messaging()
                    .sendMulticast(message_ios)
                    .then(function (response) {
                        console.log("[firebase/push_send] Successfully sent message" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , response);
                    })
                    .catch(function (err) {
                        console.log("[firebase/push_send] Error Sending message" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , err);
                    })
                    console.log("[notice/write] 공지사항이 저장되었습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '공지사항이 저장되었습니다.';
                    return res.json(responseData);
                } else { //fcm 알림 없음
                    console.log("[notice/write] 공지사항이 저장되었습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '공지사항이 저장되었습니다.';
                    return res.json(responseData);
                }
            })
        }
    })
});

router.get('/list/top', function(req, res){
    var responseData = {};

    connection.query('select * from noticelist where fixTop=true order by timeStamp desc',function(err,rows){
        if(err) throw err;
        if(rows[0]){
            var count = rows.length;
            var conArr = [];
            for(var i=0;i<5&&i<count;i++){ //페이징 처리
                if(rows[i].fixTop==true){
                    rows[i].fixTop=true
                }
                else{
                    rows[i].fixTop=false
                }
                rows[i].realTop=true
                conArr.push(rows[i]);
            }
            console.log("[notice/list/top] 상단 공지사항 목록을 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
            responseData.check = true;
            responseData.code = 200;
            responseData.message = "상단 공지사항 목록을 요청하였습니다.";
            responseData.content = conArr;
            return res.json(responseData);
        }
        else{
            console.log("[notice/list/top] 상단 공지사항 목록을 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
            responseData.check = true;
            responseData.code = 201;
            responseData.message = "상단 공지사항 목록을 요청하였습니다.";
            responseData.content = rows;
            return res.json(responseData);
        
        }
    })

});

router.get('/list', function(req, res){
    var responseData = {};
    var page = req.query.page;

    connection.query('select * from noticelist order by timeStamp desc',function(err,rows){
        if(err) throw err;
        if(rows[0]){
            var count = rows.length;
            var conArr = [];
            for(var i=(page-1)*10;i<page*10&&i<count;i++){ //페이징 처리
                if(rows[i].fixTop==true){
                    rows[i].fixTop=true
                    rows[i].realTop=false
                }
                else{
                    rows[i].fixTop=false
                    rows[i].realTop=false
                }
                conArr.push(rows[i]);
            }
            console.log("[notice/list] 공지사항 목록을 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
            responseData.check = true;
            responseData.code = 200;
            responseData.message = "공지사항 목록을 요청하였습니다.";
            responseData.content = conArr;
            return res.json(responseData);
        }
        else{
            console.log("[notice/list] 공지사항 목록을 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
            responseData.check = true;
            responseData.code = 201;
            responseData.message = "공지사항 목록을 요청하였습니다.";
            responseData.content = rows;
            return res.json(responseData);
        
        }
    })

});

router.post('/access', function(req, res){
    var responseData = {};
    var notice_no = req.body.notice_no;

    connection.query('select * from noticelist where notice_no=?',[notice_no],function(err,rows){
        if(err) throw err;
        if(rows[0]){
            var count = rows[0].viewCount + 1;
            var arr = rows[0];
            connection.query('update noticelist set viewCount=? where notice_no=?',[count, notice_no],function(err,rows){
                if(err) throw err;
                console.log("[notice/access] [" + notice_no + "] 번 공지사항에 접근하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                responseData.check = true;
                responseData.code = 200;
                responseData.message = "공지사항에 접근하였습니다.";
                responseData.content = arr;
                return res.json(responseData);
            })
        }
        else{
            console.log("[notice/access] [" + notice_no + "] 번 공지사항을 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
            responseData.check = false;
            responseData.code = 301;
            responseData.message = "해당 공지사항을 찾을 수 없습니다.";
            return res.json(responseData);
        
        }
    })
});


module.exports = router;

