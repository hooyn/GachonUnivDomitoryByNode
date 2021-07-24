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


router.post('/', function(req, res){
    var responseData = {};
    var curUser = req.query.curUser;
    var no = req.query.no;
    var title = req.query.title;
    var category = req.query.category;
    var text = req.query.text;

  
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
    else if(!no){
        responseData.check = false;
        responseData.code = 304;
        responseData.message = '해당 글이 없습니다.';
        return res.json(responseData);
    }
    else{
        var query=connection.query('select * from articlelist where no=?', [no], function(err, rows){
            if(err) throw err;
            if(rows[0].writeUser==curUser){
                    var sql = 'update articlelist set title=?, category=?, text=? where no=?';
                    var query = connection.query(sql, [title, category, text, no], function(err, rows){
                    if(err) throw err;
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '글이 수정되었습니다.';
                    return res.json(responseData);
                })
            }
            else{
                responseData.check = false;
                responseData.code = 305;
                responseData.message = '글의 작성자가 아닙니다.';
                return res.json(responseData);
            }
        })
    }
});


module.exports = router;

