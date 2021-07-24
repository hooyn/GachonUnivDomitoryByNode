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

router.post('/articlelist', function(req, res){
    var responseData = {};
    connection.query('ALTER TABLE articlelist AUTO_INCREMENT=1;', function(err, rows){
        if(err) throw err;
    })
    connection.query('SET @COUNT = 0;', function(err, rows){
        if(err) throw err;
    })
    connection.query('UPDATE articlelist SET no = @COUNT:=@COUNT+1;', function(err, rows){
        if(err) throw err;
        responseData.check = true;
        responseData.code = 200;
        responseData.message = '글의 아이디가 정렬되었습니다.';
        return res.json(responseData);
    })
    
});
router.post('/user', function(req, res){
    var responseData = {};
    connection.query('ALTER TABLE user  AUTO_INCREMENT=1;', function(err, rows){
        if(err) throw err;
    })
    connection.query('SET @COUNT = 0;', function(err, rows){
        if(err) throw err;
    })
    connection.query('UPDATE user SET no = @COUNT:=@COUNT+1;', function(err, rows){
        if(err) throw err;
        responseData.check = true;
        responseData.code = 200;
        responseData.message = '유저 데이터베이스 번호가 정렬되었습니다.';
        return res.json(responseData);
    })
    
});


module.exports = router;

