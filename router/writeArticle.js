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
    var title = req.query.title;
    var category = req.query.category;
    var writeUser = req.query.writeUser;
    var text = req.query.text;

    var sql = 'insert into articlelist (title, category, writeUser, text) values (?, ?, ?, ?)';
    if(!title){
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
    else{
        var query = connection.query(sql, [title, category, writeUser, text], function(err, rows){
            if(err) throw err;
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '글이 저장되었습니다.';
            connection.query('ALTER TABLE articlelist AUTO_INCREMENT=1;', function(err, rows){
                if(err) throw err;
            })
            connection.query('SET @COUNT = 0;', function(err, rows){
                if(err) throw err;
            })
            connection.query('UPDATE articlelist SET no = @COUNT:=@COUNT+1;', function(err, rows){
                if(err) throw err;
            })
            return res.json(responseData);
        })
    }
});


module.exports = router;

