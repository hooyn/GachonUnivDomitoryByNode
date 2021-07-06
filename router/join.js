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
    //res.sendFile(path.join(__dirname, '../public/join.html'));
    var msg;
    var errMsg = req.flash('error')
    if(errMsg) msg = errMsg;
    res.render('join.ejs', {'message' : msg});
});

passport.serializeUser(function(user, done){
    console.log('passport session save : ', user.id, )
    done(null, user.id) //line49에서 user에게 넘겨준 값을 
});

passport.deserializeUser(function(id, done){
    console.log('passport session getdata : ', id)
    done(null, id);
});

passport.use('local-join', new LocalStrategy({
    usernameField: 'id',
    nicknameField: 'nickname',
    passReqToCallback: true
}, function(req, id, nickname, done){
    var query = connection.query('select * from userlogin where nickname=?', [nickname], function(err, rows){
        if(err) return done(err);
        
        if(rows.length){ //이미 아이디가 있다면 이미 있다는 메세지와 함께 err
            console.log('existed nickname');
            return done(null, false, {message : 'your nickname is already used'})
        } else if(nickname<6) {
            console.log('nickname length false');
            return done(null, false, {message : 'your nickname is false'})
        } else {
            console.log('create user');
            var query = connection.query('update userlogin set nickname=? where id=?', [nickname, id], function(err, rows){
                if(err) throw err
                return done(null, {'nickname':nickname, 'id':id});
                //세션에 담을 정보를 넘겨준다. user에게 담아서 serialize에게 전달
            })
        }
    })
}));

router.post('/',  function(req, res, next){
    passport.authenticate('local-join', function(err, user, info){
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