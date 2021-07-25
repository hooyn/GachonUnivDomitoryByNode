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


router.post('/', function(req, res){
    var responseData = {};
    var curUser = req.body.curUser;
    var no = req.body.no;

    var query=connection.query('select * from articlelist where no=?', [no], function(err, rows){
        if(err) throw err;
        if(rows[0].writeUser==curUser){
            var sql = 'delete from articlelist where no=?';
            var query = connection.query(sql, [no], function(err, rows){
                if(err) throw err;
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '글이 삭제되었습니다.';
                return res.json(responseData);
            })
        }
        else{
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '글의 작성자가 아닙니다.';
            return res.json(responseData);
        }
    })

    
});


module.exports = router;
