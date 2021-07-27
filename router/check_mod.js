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
    var no = req.body.no;
 
    var query = connection.query('select * from articlelist where no=?',[no], function(err, rows_a){
        if(err) throw err;
        if(rows_a[0]){
            var query = connection.query('select * from user where id=?',[curUser],function(err, rows){
                if(rows[0]){
                    if(rows_a[0].userId==curUser){
                        responseData.check = true;
                        responseData.code = 200;
                        responseData.message = '사용자가 작성한 글이 맞습니다.';
                        return res.json(responseData);
                    } else {
                        responseData.check = false;
                        responseData.code = 303;
                        responseData.message = '사용자가 작성한 글이 아닙니다.';
                        return res.json(responseData);
                    }
                }
                else{
                    responseData.check = false;
                    responseData.code = 301;
                    responseData.message = '아이디가 일치하지 않습니다.';
                    return res.json(responseData);
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
});


module.exports = router;

