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
    var no = req.body.no;
    var count;
    var query = connection.query('select * from articlelist where no=?',[no],function(err, rows){
        if(err) throw err;
        if(rows.length){
            count = rows[0].viewCount + 1;
            var query = connection.query('update articlelist set viewCount=? where no=?', [count, no], function(err, rows){
                if(err) throw err;
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '조회수가 증가하였습니다.';
                return res.json(responseData);
            })
        }
        else{
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '해당 글이 존재하지 않습니다.';
            return res.json(responseData);
        }
    })
});

router.post('/getViewCount', function(req, res){
    var responseData = {};
    var no = req.body.no;
    var query = connection.query('select viewCount from articlelist where no=?',[no],function(err, rows){
        if(err) throw err;
        if(rows.length){
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '해당 글의 조회수를 불러왔습니다.';
            responseData.content = rows[0];
            return res.json(responseData);
        }
        else{
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '해당 글이 존재하지 않습니다.';
            return res.json(responseData);
        }
    })
});

module.exports = router;

