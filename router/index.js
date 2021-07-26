const express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var main = require('./main');
var nicknameCheck = require('./nicknameCheck');
var nicknameSet= require('./nicknameSet');
var login = require('./login');
var logout = require('./logout')
var calmenu = require('./calmenu')
var writeArticle = require('./writeArticle')
var modifyArticle = require('./modifyArticle')
var deleteArticle = require('./deleteArticle')
var search = require('./search')
var home = require('./home')
var sort = require('./sort')
var getUser = require('./getUser')
var accessArticle = require('./accessArticle')
var check_mod = require('./check_mod')
var articlelist_trash = require('./articlelist_trash')
var report = require('./report')
var reportlist = require('./reportlist')
var reply = require('./reply')
var check_replymod = require('./check_replymod')

//url routing
router.get('/', function(req, res){
	console.log('index load');
});

router.use('/main', main);
router.use('/nicknameCheck', nicknameCheck);
router.use('/nicknameSet', nicknameSet);
router.use('/login', login)
router.use('/logout', logout)
router.use('/calmenu', calmenu)
router.use('/writeArticle', writeArticle)
router.use('/modifyArticle', modifyArticle)
router.use('/deleteArticle', deleteArticle)
router.use('/search', search)
router.use('/home', home)
router.use('/sort', sort)
router.use('/getUser', getUser)
router.use('/accessArticle', accessArticle)
router.use('/check_mod', check_mod)
router.use('/articlelist_trash', articlelist_trash)
router.use('/report', report)
router.use('/reportlist', reportlist)
router.use('/reply', reply)
router.use('/check_replymod', check_replymod)

module.exports = router;