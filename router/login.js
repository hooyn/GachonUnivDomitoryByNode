const express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const { json } = require('body-parser');

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

//Router Setting
router.get('/', function(req, res){
    var msg;
    var errMsg = req.flash('error')
    if(errMsg) msg = errMsg;
    res.render('login.ejs', {'message' : msg});
});

passport.serializeUser(function(user, done){
    console.log('passport session save : ', user.id, )
    done(null, user.id) //line49에서 user에게 넘겨준 값을 
});

passport.deserializeUser(function(id, done){
    console.log('passport session getdata : ', id)
    done(null, id);
});

passport.use('local-login', new LocalStrategy({
    checkField: 'check',
    codeField: 'code',
    usernameField: 'id',
    passwordField: 'password',
    nicknameField: 'nickname',
    passReqToCallback: true
}, function(_req, id, password, done){
    //이부분
    var query = connection.query('select * from user where id=?', [id], function(err, rows){
        if(err) return done(err);
        //console.log(rows[0].nickname); 찾았다 요놈
        if(rows.length){ //이미 아이디가 있다면 이미 있다는 메세지와 함께 err
            if(password.length < 6){
                return done(null, false, {'check':false, 'code':304, 'message' : '비밀번호가 6자리 이하입니다.'})
            }
            else {
                var query = connection.query('select * from user where password=?',[password], function(err, rows){
                    if(err) return done(err)
                    if(rows.length&&rows[0].nickname){ 
                        return done(null, {'check':true, 'code':200, 'id':id, 'password':password, 'nickname':true})
                        //세션에 담을 정보를 넘겨준다. user에게 담아서 serialize에게 전달
                    } else if(rows.length){
                        return done(null, {'check':true, 'code':200, 'id':id, 'password':password, 'nickname':false})
                    } else {
                        return done(null, false, {'check':false, 'code':302, 'message' : '비밀번호가 틀렸습니다.'})
                    }
                })
            }
        }else {
            return done(null, false, {'check':false, 'code':301, 'message' : '아이디 정보를 찾지 못했습니다.'}) 
        };
    })
}
));

router.post('/',  function(req, res, next){
    passport.authenticate('local-login', function(err, user, info){
        if(err) res.status(500).json(err);
        if(!user) return res.status(401).json(info);

        req.logIn(user, function(err) {
            //serialize에서 처리가 돼서 내려온다. user에 정보를 담아서 온다.
            if(err) { return next(err); }
            return res.json(user); //json으로 응답을 준다.
        });
    })(req,res,next); //authenticate가 반환하는 값들을 추가적으로 처리해줘야 한다.
    //그래야 위에 //이부분으로 갈 수 있다.
});

module.exports = router;