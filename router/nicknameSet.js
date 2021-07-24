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
    var id = req.body.id;
    var nickname = req.body.nickname;

    var query = connection.query('select * from user where id=?', [id], function(err, rows){
        if(err) return done(err);
        if(rows.length){ 
            var query = connection.query('select * from user where nickname=?', nickname, function(err, rows){
                if(err) return done(err);
                if(rows.length){
                    responseData.check = false;
                    responseData.code = 304;
                    responseData.message = '닉네임이 중복되었습니다.';
                    return res.json(responseData);
                }
                else{
                    if(nickname.length<2 ) {
                        responseData.check = false;
                        responseData.code = 301;
                        responseData.message ='2글자 이상의 닉네임을 설정해주세요.';
                        return res.json(responseData);
                    }else if(req.body.nickname.length>=8) {
                        responseData.check = false;
                        responseData.code = 302;
                        responseData.message ='8글자 이하의 닉네임을 설정해주세요.';
                        return res.json(responseData);
                    } else {
                        var query = connection.query('update user set nickname=? where id=?', [nickname, id], function(err, rows){
                            if(err) throw err
                            responseData.check = true;
                            responseData.code = 200;
                            responseData.message = '닉네임 추가 & 로그인 성공';
                            return res.json(responseData);
                        })
                    }
                }
            })
        } else {
            responseData.check = false;
            responseData.code = 303;
            responseData.message = '아이디가 없습니다.';
            return res.json(responseData);
        }
    })

});


module.exports = router;
