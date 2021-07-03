const express = require('express');
var app = express();
var bodyParser = require('body-parser'); //post 형태의 data 받기 위해서 필요한 모듈
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');

var router = require('./router/index');

app.listen(3000, function(){
    console.log('server3000 running');
});

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs')

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(router);






