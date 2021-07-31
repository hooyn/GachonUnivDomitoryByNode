const express = require('express');
var router = express.Router();
var mysql = require('mysql');

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

//ACCESS ROUTER ARTICLELIST_TRASH
router.get('/', function(req, res){
    var responseData = {};

    var query = connection.query('select * from articlelist_trash order by timeStamp desc', function(err, rows){
                if(err) throw err;
                console.log("[articlelist_trash] 신고 접수되어 삭제된 게시물 요청" + " [ " + dateFormat(Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT") + " ] " )
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '신고 접수 되어 삭제된 게시물 업로드 완료.';
                responseData.content = rows;
                return res.json(responseData);
            })
	});

module.exports = router;