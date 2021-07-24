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
    database : 'teamsb'
});
connection.connect();


router.get('/', function(req, res){
    var responseData = {};
    var title = req.query.title;
    var category = req.query.category;
    var text = req.query.text;

    if(!title&&category){
        var query = connection.query('select * from articlelist where category=?', category, function(err, rows){
            if(err) throw err;
            if(rows){
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '카테고리에 따른 검색 완료.';
                responseData.content = rows;
                return res.json(responseData);
            }
        })

    }
    else if(title&&!category){
        var query = connection.query('select * from articlelist where title like ?', '%' + title + '%', function(err, rows){
            if(err) throw err;
            if(rows){
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '제목에 따른 검색 완료.';
                responseData.content = rows;
                return res.json(responseData);
            }
        })

    }
    else if(title&&category){
        var query = connection.query('select * from articlelist where title like ? and category=?', ['%' + title + '%', category] , function(err, rows){
            if(err) throw err;
            if(rows){
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '제목과 카테고리에 따른 검색 완료.';
                responseData.content = rows;
                return res.json(responseData);
            }
        })
    }
    else if(!title&&!category&&text){
        var query = connection.query('select * from articlelist where text like ?', ['%' + text + '%'] , function(err, rows){
            if(err) throw err;
            if(rows){
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '내용에 따른 검색 완료';
                responseData.content = rows;
                return res.json(responseData);
            }
        })
    }
    else if(title&&category&&text){
        var query = connection.query('select * from articlelist where title like ? and category=? and text like ?', ['%' + title + '%', category, '%' + text + '%'] , function(err, rows){
            if(err) throw err;
            if(rows){
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '내용에 따른 검색 완료';
                responseData.content = rows;
                return res.json(responseData);
            }
        })
    }
    else{
        responseData.check = false;
        responseData.code = 301;
        responseData.message = '검색 내용이 없습니다.';
        return res.json(responseData);
    }
});


module.exports = router;

