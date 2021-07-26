const { EFAULT } = require('constants');
const express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var path = require('path');

//DATABASE SETTING
var connection = mysql.createConnection({
    host : '13.209.10.30',
    port : 3306,
    user : 'root',
    password : 'owner9809~',
    database : 'teamsb',
    dateStrings : 'date'
});
connection.connect();

router.post('/write', function(req, res){
    var responseData = {};
    var article_no = req.body.article_no;
    var content = req.body.content;
    var curUser = req.body.curUser;
    var nickname;

    var query = connection.query('select * from user where id=?',[curUser],function(err, rows_u){
        if(err) throw err;
        if(rows_u[0]){
            nickname = rows_u[0].nickname;
            var query = connection.query('select * from articlelist where no=?',[article_no], function(err, rows){
                if(err) throw err;
                if(rows[0]){
                    var query = connection.query('insert into replylist(article_no, content, userId, userNickname) values (?, ?, ?, ?)',[article_no, content, curUser, nickname], function(err, rows){
                        if(err) throw err;
                        responseData.check = true;
                        responseData.code = 200;
                        responseData.message = '댓글이 등록되었습니다.';
                        return res.json(responseData);
                    })
                }
                else{
                    responseData.check = false;
                    responseData.code = 302;
                    responseData.message = '존재하지 않는 글입니다.';
                    return res.json(responseData);
                }
            })
        }
        else{
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '아이디를 확인해주세요.';
            return res.json(responseData);
        }
    })
});

router.post('/modify', function(req, res){
    var responseData = {};
    var reply_no = req.body.reply_no;
    var content = req.body.content;
    var curUser = req.body.curUser;
    var userId;

    var query = connection.query('select * from replylist where reply_no=?',[reply_no],function(err, rows_r){
        if(err) throw err;
        if(rows_r){
            if(!content){
                responseData.check = false;
                responseData.code = 303
                responseData.message = '댓글 내용을 입력해주세요.';
                return res.json(responseData);
            }
            userId = rows_r[0].userId;
            if(userId==curUser){
                var query = connection.query('update replylist set content=? where reply_no=?', [content, reply_no], function(err, rows){
                    if(err) throw err;
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '댓글이 수정되었습니다.';
                    return res.json(responseData);
                })
            }
            else{
                responseData.check = false;
                responseData.code = 302;
                responseData.message = '댓글을 작성한 사용자와 다릅니다.';
                return res.json(responseData);
            }
        }
        else{
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '존재하지 않는 댓글입니다.';
            return res.json(responseData);
        }

    })
    
});

router.post('/delete', function(req, res){
    var responseData = {};
    var curUser = req.body.curUser;
    var reply_no = req.body.reply_no;


    var query=connection.query('select * from replylist where reply_no=?', [reply_no], function(err, rows){
        if(err) throw err;
        if(rows[0].userId==curUser){
            var sql = 'delete from replylist where reply_no=?';
            var query = connection.query(sql, [reply_no], function(err, rows){
                if(err) throw err;
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '글이 삭제되었습니다.';
                return res.json(responseData);
            })
        }
        else{
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '댓글의 작성자가 아닙니다.';
            return res.json(responseData);
        }
    })
});

router.post('/list', function(req, res){
    var responseData = {};
    var curUser = req.body.curUser;
    var article_no = req.body.article_no;

    var query = connection.query('select * from user where id=?',[curUser],function(err,rows){
        if(err) throw err;
        if(rows[0]){
            var query = connection.query('select * from replylist where article_no=?',[article_no], function(err, rows){
                if(err) throw err;
                for(var i=0;i<rows.length;i++){
                    if(rows[i].userId==curUser){
                        rows[i].right=true;
                    }
                    else{
                        rows[i].right=false;
                    }
                }
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '댓글 불러오기 성공.';
                responseData.content = rows;
                return res.json(responseData);
                
            })
        }
        else{
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '아이디를 확인해주세요.';
            return res.json(responseData);
        }
    })



});

    module.exports = router; 


    