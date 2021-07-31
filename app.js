const express = require('express');
const helmet = require('helmet');
var app = express();
var bodyParser = require('body-parser'); //post 형태의 data 받기 위해서 필요한 모듈
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var router = require('./router/index');
var func = require('./function');

func.handleDisconnect();

app.listen(3000, function(){
    console.log('server3000 running');
});

app.use(express.static('public'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(router);






