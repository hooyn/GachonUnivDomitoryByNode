const express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dateFormat = require('dateformat');
var fs = require('fs'); 
var Blob = require('blob');

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
//ACCESS ROUTER CURVERSION
router.get('/ios', function(req, res){
    console.log("[curVersion] 현재 [ios] App Version을 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
    var responseData = {
        "check": true,
        "code": 200,
        "message": "현재 [ios] App Version입니다.",
        "curVersion": "1.0.0"
    };
    res.json(responseData);
});

router.get('/aos', function(req, res){
    console.log("[curVersion] 현재 [aos] App Version을 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
    var responseData = {
        "check": true,
        "code": 200,
        "message": "현재 [aos] App Version입니다.",
        "curVersion": "1.0.0"
    };
    res.json(responseData);
});


module.exports = router;









