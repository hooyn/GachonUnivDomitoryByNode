const express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var main = require('./main');
var nickname = require('./nickname');
var join = require('./join');

//url routing
router.get('/', function(req, res){
    console.log('indexjs/path loaded');
    res.sendFile(path.join(__dirname, '../public/main.html'))
});

router.use('/main', main);
router.use('/nickname', nickname);
router.use('/join', join);

module.exports = router;