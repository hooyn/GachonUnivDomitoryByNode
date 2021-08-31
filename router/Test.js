const express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dateFormat = require('dateformat');
var fs = require('fs');
const { response } = require('express');
//var firebase = require('./firebase.js');

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

//ACCESS ROUTER REPORTLIST
router.post('/', function(req, res){
  var responseData = {};
  var article_no=req.body.article_no;
  var curUser=req.body.curUser;
  var query = connection.query('select * from user where id=?',[curUser],function(err, rows_u){
    if(err) throw err;
    var query = connection.query('select articlelist.*, user.isAndroid from articlelist inner join user on articlelist.userId=user.id where articlelist.no=?;',[article_no], function(err, rows_a){
      if(err) throw err;
      if(rows_a[0]){
              var user_tokens_aos = [];
              var user_tokens_ios = [];
              var user_id = [];
              var sql = 'select id, token, isAndroid from user where id in ( select distinct userId from replylist where article_no=? UNION select userId from replylist where article_no=? )';
              connection.query(sql,[article_no, article_no],function(err,rows){
                  if(err) throw err;
                  if(rows_a[0].isAndroid==true){
                      user_tokens_aos.push(rows_a[0].token); //글 작성자 토큰 추카
                      user_id.push(rows_a[0].userId)
                      for(var i = 0; i<rows.length;i++){
                        if (rows[i]/*기존 댓글을 단 사용자*/.token==null){ 
                            continue;
                        } else if (rows[i]/*기존 댓글을 단 사용자*/.token==rows_u[0].token/*현재 댓글을 단 사용자*/){
                            continue;
                        } else if (rows[i].token==rows_a[0].token){
                            continue;
                        } else if (rows[i].token==user_tokens_aos[0]){
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
                  } else {
                      user_tokens_ios.push(rows_a[0].token);
                      user_id.push(rows_a[0].userId)
                      for(var i = 0; i<rows.length;i++){
                        if (rows[i]/*기존 댓글을 단 사용자*/.token==null){ 
                            continue;
                        } else if (rows[i]/*기존 댓글을 단 사용자*/.token==rows_u[0].token/*현재 댓글을 단 사용자*/){
                            continue;
                        } else if (rows[i].token==rows_a[0].token){
                            continue;
                        } else if (rows[i].token==user_tokens_ios[0]){
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
                  }
                  if((rows_u[0].token/*현재 댓글을 단 사용자*/==rows_a[0]/*글 작성한 사용자*/.token)&&rows_a[0].isAndroid==true){
                      user_tokens_aos.shift();
                      user_id.shift();
                  }
                  if((rows_u[0].token/*현재 댓글을 단 사용자*/==rows_a[0]/*글 작성한 사용자*/.token)&&rows_a[0].isAndroid==false){
                      user_tokens_ios.shift();
                      user_id.shift();
                  }
                  if(user_id==""){
                    responseData.check = false;
                    responseData.code = 301;
                    responseData.message = '테스트.';
                    responseData.user = user_id
                    return res.json(responseData);
                  }
                  responseData.check = true;
                  responseData.code = 200;
                  responseData.message = '테스트.';
                  responseData.user = user_id
                  return res.json(responseData);
                })
              }
            })
          })
        })


module.exports = router;