const express = require('express');
var router = express.Router();
var dateFormat = require('dateformat');
var nicknameCheck = require('./nicknameCheck'); //닉네임 중복 체크 API
var nicknameSet= require('./nicknameSet'); 
var login = require('./login');
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
var cleanArticle = require('./cleanArticle')
var myArticlelist = require('./myArticlelist')
var feedback = require('./feedback')
var profileSet = require('./profileSet')
var Test = require('./Test')
var getToken = require('./getToken')
var notification = require('./notification')
var notice = require('./notice')
var deleteToken = require('./deleteToken')
var topBanner = require('./topBanner')
var guide = require('./guide')



//url routing
router.get('/', function(req, res){
	console.log('index load' + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
});

router.use('/nicknameCheck', nicknameCheck);
router.use('/nicknameSet', nicknameSet);
router.use('/login', login)
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
router.use('/cleanArticle', cleanArticle)
router.use('/myArticlelist', myArticlelist)
router.use('/feedback', feedback)
router.use('/profileSet', profileSet)
router.use('/Test', Test)
router.use('/getToken', getToken)
router.use('/notification', notification)
router.use('/notice', notice)
router.use('/deleteToken', deleteToken)
router.use('/topBanner', topBanner)
router.use('/guide', guide)



module.exports = router;