const express = require('express');
var app = express();
var router = express.Router();
var path = require('path');

router.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../public/main.html'))
});

module.exports = router; //다른 파일에서 이 파일을 쓸 수 있게 한다.