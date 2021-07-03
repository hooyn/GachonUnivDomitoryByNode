const express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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
    usernameField: 'id',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, id, password, done){
    //이부분
    var query = connection.query('select * from userlogin where id=?', [id], function(err, rows){
        if(err) return done(err);
        
        if(rows.length){ //이미 아이디가 있다면 이미 있다는 메세지와 함께 err
            return done(null, {'id':id, 'password':password})
            //세션에 담을 정보를 넘겨준다. user에게 담아서 serialize에게 전달
        } else {
            return done(null, false, {'message' : 'your login info is not found'}) 
        };
    })
}
));

router.post('/',  function(req, res, next){
    passport.authenticate('local-login', function(err, user, info){
        if(err) res.status(500).json(err);
        if(!user) return res.status(401).json(info.message);

        req.logIn(user, function(err) {
            //serialize에서 처리가 돼서 내려온다. user에 정보를 담아서 온다.
            if(err) { return next(err); }
            return res.json(user); //json으로 응답을 준다.
        });
    })(req,res,next); //authenticate가 반환하는 값들을 추가적으로 처리해줘야 한다.
    //그래야 위에 //이부분으로 갈 수 있다.
});

module.exports = router;