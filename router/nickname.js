const express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var path = require('path');

//DATABASE SETTING
var connection = mysql.createConnection({
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : 'owner9809~',
    database : 'teamsb'
});

connection.connect();

//Router Setting
router.post('/nickname', function(req, res){
    console.log(req.body.nickname)
    
    //<방법1>//
    //res.send('<h1>welcome !!' + req.body.nickname + '</h1>');
    
    //<방법2>// => nickname.ejs 에서 <%= %> 부분에서 nickname부분을 찾아서 req.body.nickname으로 치환
    res.render('nickname.ejs', {'nickname' : req.body.nickname});
    
});
router.post('/ajax', function(req, res){
    var nickname = req.body.nickname;
    var responseData = {};
    
    var query = connection.query('select nickname from nickname where nickname="' + nickname + '"', function(err, rows){
        if(err) throw err;
        if(rows[0]){
            console.log(rows[0].nickname);
            responseData.result = "ok";
            responseData.code = 200;
            responseData.nickname = rows[0].nickname;
        } else {
            responseData.result = "none";
            responseData.code = 301;
            responseData.nickname = "";
        }
        res.json(responseData);
    })
});


module.exports = router;









