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
    var title = req.body.title;
    var category = req.body.category;
    var text = req.body.text;
    var page = req.query.page;

    if(title&&category&&!text){
        var query = connection.query('select * from articlelist where title like ? and category=? order by timeStamp desc', ['%' + title + '%', category] , function(err, rows){
            if(err) throw err;
            if(rows){
                var count = rows.length;
                var conArr = [];
                for(var i=(page-1)*10;i<page*10&&i<count;i++){
                    var hash = [];
                    if(rows[i].hash_1){
                        hash.push(rows[i].hash_1)
                        if(rows[i].hash_2){
                            hash.push(rows[i].hash_2)
                            if(rows[i].hash_3){
                                hash.push(rows[i].hash_3)
                            }
                        }
                    }
                    rows[i].hash = hash;
                    delete rows[i].hash_1;
                    delete rows[i].hash_2;
                    delete rows[i].hash_3;
                    conArr.push(rows[i]);
                }
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '제목과 카테고리에 따른 검색 완료.';
                responseData.content = conArr;
                return res.json(responseData);
            }
        })
    }
    else if(!title&&!category&&text){
        var query = connection.query('select * from articlelist where text like ? order by timeStamp desc', ['%' + text + '%'] , function(err, rows){
            if(err) throw err;
            if(rows){
                var count = rows.length;
                var conArr = [];
                for(var i=(page-1)*10;i<page*10&&i<count;i++){
                    var hash = [];
                    if(rows[i].hash_1){
                        hash.push(rows[i].hash_1)
                        if(rows[i].hash_2){
                            hash.push(rows[i].hash_2)
                            if(rows[i].hash_3){
                                hash.push(rows[i].hash_3)
                            }
                        }
                    }
                    rows[i].hash = hash;
                    delete rows[i].hash_1;
                    delete rows[i].hash_2;
                    delete rows[i].hash_3;
                    conArr.push(rows[i]);
                }
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '내용에 따른 검색 완료';
                responseData.content = conArr;
                return res.json(responseData);
            }
        })
    }
    else if(title&&category&&text){
        var query = connection.query('select * from articlelist where title like ? and category=? or text like ? order by timeStamp desc', ['%' + title + '%', category, '%' + text + '%'] , function(err, rows){
            if(err) throw err;
            if(rows){
                var count = rows.length;
                var conArr = [];
                for(var i=(page-1)*10;i<page*10&&i<count;i++){
                    var hash = [];
                    if(rows[i].hash_1){
                        hash.push(rows[i].hash_1)
                        if(rows[i].hash_2){
                            hash.push(rows[i].hash_2)
                            if(rows[i].hash_3){
                                hash.push(rows[i].hash_3)
                            }
                        }
                    }
                    rows[i].hash = hash;
                    delete rows[i].hash_1;
                    delete rows[i].hash_2;
                    delete rows[i].hash_3;
                    conArr.push(rows[i]);
                }
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '제목, 카테고리, 내용에 따른 검색 완료';
                responseData.content = conArr;
                return res.json(responseData);
            }
        })
    }
    else if(title&&!category&&text){
        var query = connection.query('select * from articlelist where title like ? or text like ? order by timeStamp desc', ['%' + title + '%', '%' + text + '%'] , function(err, rows){
            if(err) throw err;
            if(rows){
                var count = rows.length;
                var conArr = [];
                for(var i=(page-1)*10;i<page*10&&i<count;i++){
                    var hash = [];
                    if(rows[i].hash_1){
                        hash.push(rows[i].hash_1)
                        if(rows[i].hash_2){
                            hash.push(rows[i].hash_2)
                            if(rows[i].hash_3){
                                hash.push(rows[i].hash_3)
                            }
                        }
                    }
                    rows[i].hash = hash;
                    delete rows[i].hash_1;
                    delete rows[i].hash_2;
                    delete rows[i].hash_3;
                    conArr.push(rows[i]);
                }
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '제목, 내용에 따른 검색 완료';
                responseData.content = conArr;
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

