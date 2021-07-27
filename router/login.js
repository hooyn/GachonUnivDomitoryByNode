const { json } = require('body-parser');
const { timeStamp } = require('console');
const express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var path = require('path');
var request = require("request");

출처: https://sjh836.tistory.com/89 [빨간색코딩]

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
    var userId = req.body.userId;
    var password = req.body.password;
    request({ 
        uri: 'http://smart.gachon.ac.kr:8080/WebJSON', 
        method: 'post', 
        body:{
            fsp_cmd:'login',
            DVIC_ID:'dwFraM1pVhl6mMn4npgL2dtZw7pZxw2lo2uqpm1yuMs=',
            fsp_action:'UserAction',
            USER_ID:userId,
            PWD:password,
            APPS_ID:'com.sz.Atwee.gachon'
        },
        json: true
    }, 
        function(error, response, body) {
            var result = {};
            if(body.ErrorCode=="0"){
                var query = connection.query('select * from user where id=?',[userId],function(err,rows){
                    if(err) throw err;
                    if(rows[0]&&rows[0].certified==true&&rows[0].nickname){
                        result.check=true;
                        result.code=200;
                        result.nickname=true;
                        result.message="로그인 성공.";
                        return res.json(result);
                    }
                    else if(rows[0]&&rows[0].certified==true&&!rows[0].nickname){ // 학교 인증 성공 -> 닉네임 설정X
                        result.check=true;
                        result.code=202;
                        result.nickname=false;
                        result.message="닉네임을 설정해야 합니다.";
                        return res.json(result);
                    }
                    else{ // 학교 인증 성공 -> id저장 X
                        connection.query('insert into user(id, user_no, certified) values(?, ?, ?);',[body.ds_output.userId,  body.ds_output.userUniqNo, true], function(err, rows){
                            if(err) throw err;
                            result.check=true;
                            result.code=201;
                            result.nickname=false;
                            result.message="로그인 성공 & 유저 정보 DB 추가 & 닉네임 설정 필요"
                            result.userName = body.ds_output.userNm;
                            result.userNo = body.ds_output.userUniqNo;
                            result.userId = body.ds_output.userId;
                            result.email = body.ds_output.eml;
                            result.telNo = body.ds_output.telNo;
                            result.dept = body.ds_output.clubList.clubNm;
                            return res.json(result);
                        })
                    }
                })
            }
            else{
                result.check=false;
                result.code=301;
                result.message="아이디 또는 비밀번호가 일치하지 않습니다.";
                return res.json(result);
            }
        } 
    );
});

module.exports = router;