const express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var main = require('./main');
var nicknameCheck = require('./nicknameCheck');
var join = require('./join');
var login = require('./login');
var logout = require('./logout')
var calmenu = require('./calmenu')
var writeArticle = require('./writeArticle')
var modifyArticle = require('./modifyArticle')
var deleteArticle = require('./deleteArticle')
var search = require('./search')
var home = require('./home')
var sortArticlelist = require('./sortArticlelist')



//url routing
router.get('/', function(req, res){
    console.log('indexjs/path loaded');
});

router.use('/main', main);
router.use('/nicknameCheck', nicknameCheck);
router.use('/join', join);
router.use('/login', login)
router.use('/logout', logout)
router.use('/calmenu', calmenu)
router.use('/writeArticle', writeArticle)
router.use('/modifyArticle', modifyArticle)
router.use('/deleteArticle', deleteArticle)
router.use('/search', search)
router.use('/home', home)
router.use('/sortArticlelist', sortArticlelist)

module.exports = router;