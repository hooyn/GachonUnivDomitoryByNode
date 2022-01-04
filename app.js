const express = require('express');
const helmet = require('helmet');
var app = express();
const admin = require('firebase-admin')
var bodyParser = require('body-parser'); //post 형태의 data 받기 위해서 필요한 모듈
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var dateFormat = require('dateformat');
var router = require('./router/index');

app.listen(3000, function(){
    console.log('server3000 running' + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " );
});

app.use(express.static('public'));
app.use(helmet());
app.use(bodyParser.json({
    limit: '5mb'
}));
app.use(bodyParser.urlencoded({
    limit: '5mb',
    extended:false
}));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(router);

//SDK initialize
let serAccount = require('**') //fcm 서버 키
admin.initializeApp({
credential: admin.credential.cert(serAccount),
})

