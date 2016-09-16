'use strict';

var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var oneDay = 86400000;

var app = express();

// body parsing for post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// compress all requests
app.use(compression());

// serve up content and give it a default expiry
app.use(express.static(__dirname + '/public', { maxAge: oneDay }));

app.listen(process.env.PORT || 8080);
