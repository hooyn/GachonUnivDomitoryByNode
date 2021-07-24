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



router.post('/', function(req, res){
    var responseData = {};
    var nickname = req.body.nickname;
    console.log(nickname);
 
    var query = connection.query('select nickname from user where nickname=?',[nickname], function(err, rows){
        if(err) throw err;
        if(rows[0]){
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '중복되는 닉네임 입니다.';
        } else {
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '사용가능한 닉네임 입니다.';
        }
        return res.json(responseData);
    })
});


module.exports = router;

