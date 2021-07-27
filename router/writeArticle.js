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
    var title = req.body.title;
    var category = req.body.category;
    var userId = req.body.userId;
    var userNickname;
    var text = req.body.text;
    var hash = req.body.hash;
    console.log("load write");

    var query = connection.query('select * from user where id=?', [userId], function(err, rows){
        if(err) throw err;
        if(rows.length){
            console.log("write" + userId);
            userNickname = rows[0].nickname;
            var sql = 'insert into articlelist (title, category, userId, userNickname, text, hash_1, hash_2, hash_3) values (?, ?, ?, ?, ?, ?, ?, ?)';
            if(!userNickname){
                responseData.check = false;
                responseData.code = 305;
                responseData.message = '닉네임이 저장되어 있지 않습니다.';
                return res.json(responseData);
            }
            else if(!title){
                responseData.check = false;
                responseData.code = 301;
                responseData.message = '제목이 없습니다.';
                return res.json(responseData);
            }

            else if(!category){
                responseData.check = false;
                responseData.code = 302;
                responseData.message = '카테고리가 없습니다.';
                return res.json(responseData);
            }
            else if(!text){
                responseData.check = false;
                responseData.code = 303;
                responseData.message = '글의 내용이 없습니다.';
                return res.json(responseData);
            }
            else if(!hash){
                var query = connection.query('insert into articlelist (title, category, userId, userNickname, text) values (?, ?, ?, ?, ?)', [title, category, userId, userNickname, text], function(err, rows){
                    if(err) throw err;
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '글이 저장되었습니다.';
                    return res.json(responseData);
                })
            }
        
            else if(hash[0]&&!hash[1]&&!hash[2]){
                var query = connection.query('insert into articlelist (title, category, userId, userNickname, text, hash_1) values (?, ?, ?, ?, ?, ?)', [title, category,userId, userNickname, text, hash[0]], function(err, rows){
                    if(err) throw err;
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '글이 저장되었습니다.';
                    return res.json(responseData);
                })
            }
            else if(hash[0]&&hash[1]&&!hash[2]){
                var query = connection.query('insert into articlelist (title, category,userId, userNickname, text, hash_1, hash_2) values (?, ?, ?, ?, ?, ?, ?)', [title, category, userId, userNickname, text, hash[0], hash[1]], function(err, rows){
                    if(err) throw err;
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '글이 저장되었습니다.';
                    return res.json(responseData);
                })
            }
            else{
                var query = connection.query(sql, [title, category, userId, userNickname, text, hash[0], hash[1], hash[2]], function(err, rows){
                    if(err) throw err;
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '글이 저장되었습니다.';
                    return res.json(responseData);
                })
            }
        }
        else{
            responseData.check = false;
            responseData.code = 304;
            responseData.message = '사용자가 아닙니다.[ID ERROR].';
            return res.json(responseData);
        }
    })
    
});


module.exports = router;

