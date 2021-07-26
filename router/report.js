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



router.post('/', function(req, res){
    var responseData = {};
    var curUser = req.body.curUser;
    var article_no = req.body.article_no;
    var content = req.body.content;
    var count;

    var query = connection.query('select * from user where id=?',[curUser],function(err, rows_c){
        if(err) throw err;
        if(rows_c){
            var query = connection.query('select * from articlelist where no=?',[article_no],function(err, rows_a){
                if(err) throw err;
                if(rows_a){
                    count = rows_a[0].reportCount + 1;
                    var query = connection.query('select * from reportlist where article_no=? and userId=?',[article_no, curUser],function(err, rows){
                        if(err) throw err;
                        if(rows[0]){
                            responseData.check = false;
                            responseData.code = 303;
                            responseData.message = '이미 신고가 완료되었습니다.';
                            return res.json(responseData);
                        }
                        else{
                            var query = connection.query('insert into reportlist(article_no, content, userId) values (?, ?, ?)', [article_no, content, rows_c[0].id], function(err, rows){
                                if(err) throw err;
                                connection.query('update articlelist set reportCount=? where no=?',[count, article_no], function(err, rows){
                                    if(err) throw err;
                                })
                                if(count>=5){
                                    connection.query('select * from articlelist where no=?',[article_no],function(err, rows){
                                        if(err) throw err;
                                        if(rows[0]){
                                            connection.query('insert into articlelist_trash select * from articlelist where no=?',[article_no],function(err, rows){
                                                if(err) throw err;
                                            })
                                            connection.query('delete from articlelist where no=?',[article_no],function(err, rows){
                                                if(err) throw err;
                                            })
                                            responseData.check = true;
                                            responseData.code = 200;
                                            responseData.message = '해당 글의 신고가 완료되었습니다.';
                                            return res.json(responseData);
                                        }
                                        else{
                                            responseData.check = true;
                                            responseData.code = 200;
                                            responseData.message = '해당 글의 신고가 완료되었습니다.';
                                            return res.json(responseData);
                                        }
                                    })
                                }
                                else{
                                    responseData.check = true;
                                    responseData.code = 200;
                                    responseData.message = '해당 글의 신고가 완료되었습니다.';
                                    return res.json(responseData);
                                }
                            })
                        }
                    })
                }
                else{
                    responseData.check = false;
                    responseData.code = 302;
                    responseData.message = '해당 글이 존재하지 않습니다.';
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

module.exports = router;

