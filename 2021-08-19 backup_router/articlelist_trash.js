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

//ACCESS ROUTER ARTICLELIST_TRASH
router.get('/', function(req, res){
    var responseData = {};

    var query = connection.query('select * from articlelist_trash order by timeStamp desc', function(err, rows){
                if(err) throw err;
                console.log("[articlelist_trash] 신고 5회 이상 접수되어 삭제된 게시물입니다." + " [ " + dateFormat(Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT") + " ] " )
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '신고 5회 이상 접수되어 삭제된 게시물입니다.';
                responseData.content = rows;
                return res.json(responseData);
            })
	});

module.exports = router;