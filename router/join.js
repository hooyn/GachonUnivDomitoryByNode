const express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//DATABASE SETTING
var connection = mysql.createConnection({
    host : '13.209.10.30',
    port : 3306,
    user : 'root',
    password : 'owner9809~',
    database : 'teamsb'
});

connection.connect();

//Router Setting
router.get('/', function(req, res){
    var msg;
    var errMsg = req.flash('error')
    if(errMsg) msg = errMsg;
});

passport.serializeUser(function(user, done){
    console.log('passport session save : ', user, )
    done(null, user) //line49에서 user에게 넘겨준 값을 
});

passport.deserializeUser(function(id, done){
    console.log('passport session getdata : ', 'user')
    done(null, 'user');
});

passport.use('local-join', new LocalStrategy({
    usernameField: 'id',
    passwordField: 'nickname',
    checkField: 'check',
    codeField: 'code',
    passReqToCallback: true
}, function(req, id, nickname, done){
    var query = connection.query('select * from user where id=?', [id], function(err, rows){
        if(err) return done(err);
        
        if(rows.length){ 
            if(rows[0].nickname) {
                return done(null, {'check': true, 'code': 200, 'message' : rows[0].nickname + '님 안녕하세요.'})
            }else if(nickname.length<8&&nickname.length>2) {
                return done(null, false, {'check': false, 'code': 301, 'message' : '닉네임을 다시 확인해주세요.'})
            } else {
                var query = connection.query('update user set nickname=? where id=?', [nickname, id], function(err, rows){
                    if(err) throw err
                    return done(null, {'check': true, 'code': 200, 'id':id, 'nickname':nickname, 'message': '닉네임 추가 성공'});
                    //세션에 담을 정보를 넘겨준다. user에게 담아서 serialize에게 전달
                })
            }
        } else {
            return done(null, false, {'check': false, 'code': 302, 'message' : '아이디가 없습니다.'})
        }
    })
}));

router.post('/',  function(req, res, next){
    passport.authenticate('local-join', function(err, user, info){
        if(err) res.status(500).json(err);
        if(!user) return res.status(401).json(info);

        req.logIn(user, function(err) {
            //serialize에서 처리가 돼서 내려온다. user에 정보를 담아서 온다. dghse
            if(err) { return next(err); }
            return res.json(user); //json으로 응답을 준다.
        });
    })(req,res,next); //authenticate가 반환하는 값들을 추가적으로 처리해줘야 한다.
//그래야 위에 //이부분으로 갈 수 있다.
});
//router에서 local-join strategy로 가서 console.log()부분에서 계속 돌아감 그래서 line30 function부분에서 아이디가 있는지 없는지 판별하는 코드가 있어야 한다.

//router.post('/', function(req, res){
//    var body = req.body;
//    var name = body.name;
//    var id = body.id;
//    var password = body.password;
//    var email = body.email;
//    
//    var sql = {id : id, password : password, name : name, email : email};
//    var query = connection.query('insert ignore into users set ?', sql , function(err,rows){
//        if(err) {throw err;}
//        else res.render('welcome.ejs', {'id' : id, 'password' : password, 'name' : name, 'email' : email}); //res.json()
//    })
//});

module.exports = router;