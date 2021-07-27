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

router.get('/all', function(req, res){
    var responseData = {};
    var page = req.query.page;

    var query = connection.query('select * from articlelist order by timeStamp desc', function(err, rows){
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
                    responseData.message = '모든 게시물 업로드 완료.';
                    responseData.content = conArr;
                    return res.json(responseData);
                }
            })
	});

router.get('/recentPost', function(req, res){
    var responseData = {};

    var query = connection.query('select * from articlelist order by timeStamp desc', function(err, rows){
                if(err) throw err;
                if(rows){
                    var count = rows.length;
                    var conArr = [];
                    for(var i=0; i<5 ; i++){
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
                    responseData.message = '최근 게시물 업로드 완료.';
                    responseData.content = conArr;
                    return res.json(responseData);
                }
            })
	});

router.get('/delivery', function(req, res){
    var responseData = {};
    var category = req.query.category;
    var page = req.query.page;

    var query = connection.query('select * from articlelist where category="delivery" order by timeStamp desc', function(err, rows){
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
            responseData.message = '배달 category 불러오기 성공.';
            responseData.content = conArr;
            return res.json(responseData);
        }
    });

});

router.get('/taxi', function(req, res){
    var responseData = {};
    var category = req.query.category;
    var page = req.query.page;
    var query = connection.query('select * from articlelist where category="taxi" order by timeStamp desc', function(err, rows){
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
            console.log("taxi1");
            responseData.check = true;
            responseData.code = 200;
            responseData.message = '택시 category 불러오기 성공.';
            responseData.content = conArr;
            return res.json(responseData);
        }
    });
});

router.get('/laundry', function(req, res){
    var responseData = {};
    var category = req.query.category;
    var page = req.query.page;

    var query = connection.query('select * from articlelist where category="laundry" order by timeStamp desc', function(err, rows){
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
            responseData.message = '빨래 category 불러오기 성공.';
            responseData.content = conArr;
            return res.json(responseData);
        }
    });
});

router.get('/parcel', function(req, res){
    var responseData = {};
    var category = req.query.category;
    var page = req.query.page;

    var query = connection.query('select * from articlelist where category="parcel" order by timeStamp desc', function(err, rows){
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
            responseData.message = '택배 category 불러오기 성공.';
            responseData.content = conArr;
            return res.json(responseData);
        }
    });
});


module.exports = router;

