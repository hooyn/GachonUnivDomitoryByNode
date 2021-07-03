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

passport.use('local-join', new LocalStrategy({
    usernameField: 'id',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, id, password, done){
    var query = connection.query('select * from users where id=?', [id], function(err, rows){
        if(err) return done(err);
        
        if(rows.length){
            console.log('existed user');
            return done(null, false, {message : 'your id is already used'})
        } else {
            
        }
    })
}));

router.post('/', passport.authenticate('local-join',{
    successRediret: '/main', //성공
    failureRedirect: '/join', //실패
    failureFlash: true
})); //router에서 local-join strategy로 가서 console.log()부분에서 계속 돌아감 그래서 line30 function부분에서 아이디가 있는지 없는지 판별하는 코드가 있어야 한다.

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