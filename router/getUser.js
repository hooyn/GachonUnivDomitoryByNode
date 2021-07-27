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
    database : 'teamsb'
});
connection.connect();

router.post('/nickname', function(req, res){
    var responseData = {};
    var id = req.body.id;
 
    var query = connection.query('select * from user where id=?',[id], function(err, rows){
        if(err) throw err;
        if(rows[0].nickname){
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '아이디에 따른 닉네임 값 전달 완료.';
            responseData.content = rows[0].nickname;
        } else {
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '아이디를 확인해주세요.';
        }
        return res.json(responseData);
    })
});
router.post('/', function(req, res){
    var responseData = {};
    var id = req.body.id;
 
    var query = connection.query('select * from user where id=?',[id], function(err, rows_a){
        if(err) throw err;
        if(rows_a[0]){ 
            var query = connection.query('select * from articlelist where userId=?',[id], function(err, rows){
                var cnt = rows.length;
                rows_a[0].article_count = cnt;
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '아이디에 따른 유저 정보 전달 완료.';
                responseData.content = rows_a;
                return res.json(responseData); 
            })
        } else {
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '아이디를 확인해주세요.';
            return res.json(responseData);
        }
        
    })
});


module.exports = router;

