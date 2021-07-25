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
    var curUser = req.body.curUser; //현재 기기에 있는 id
    var no = req.body.no;
    var title = req.body.title;
    var category = req.body.category;
    var text = req.body.text;
    var hash = req.body.hash;

  
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
            if(rows[0].userId==curUser){
                if(!hash[0]&&!hash[1]&&!hash[2]){
                    var query = connection.query('update articlelist set title=?, category=?, text=? where no=?', [title, category, text, no], function(err, rows){
                        if(err) throw err;
                        responseData.check = true;
                        responseData.code = 200;
                        responseData.message = '글이 수정되었습니다.';
                        return res.json(responseData);
                    })
                }
            
                else if(hash[0]&&!hash[1]&&!hash[2]){
                    var query = connection.query('update articlelist set title=?, category=?, text=?, hash_1=? where no=?', [title, category, text, hash[0], no], function(err, rows){
                        if(err) throw err;
                        responseData.check = true;
                        responseData.code = 200;
                        responseData.message = '글이 수정되었습니다.';
                        return res.json(responseData);
                    })
                }
                else if(hash[0]&&hash[1]&&!hash[2]){
                    var query = connection.query('update articlelist set title=?, category=?, text=?, hash_1=?, hash_2=? where no=?', [title, category, text, hash[0], hash[1], no], function(err, rows){
                        if(err) throw err;
                        responseData.check = true;
                        responseData.code = 200;
                        responseData.message = '글이 수정되었습니다.';
                        return res.json(responseData);
                    })
                }
                else{
                    var query = connection.query('update articlelist set title=?, category=?, text=?, hash_1=?, hash_2=?, hash_3=? where no=?', [title, category, text, hash[0], hash[1], hash[2], no], function(err, rows){
                        if(err) throw err;
                        responseData.check = true;
                        responseData.code = 200;
                        responseData.message = '글이 수정되었습니다.';
                        return res.json(responseData);
                    })
                }
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

