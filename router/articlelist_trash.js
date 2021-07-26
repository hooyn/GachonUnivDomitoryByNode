const { timeStamp } = require('console');
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

router.get('/', function(req, res){
    var responseData = {};

    var query = connection.query('select * from articlelist_trash order by no desc', function(err, rows){
                if(err) throw err;
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '게시물 업로드 완료.';
                responseData.content = rows;
                return res.json(responseData);
            })
	});

    module.exports = router; //다른 파일에서 이 파일을 쓸 수 있게 한다.