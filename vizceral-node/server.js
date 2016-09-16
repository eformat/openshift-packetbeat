'use strict';

var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch');
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

var client = new elasticsearch.Client({
  host: 'http://elasticsearch-packetbeat.apps.eformat.nz',
  log: 'trace'
});

client.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: Infinity,

  // undocumented params are appended to the query string
  hello: "elasticsearch!"
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});

client.search({
 index: 'packetbeat-*',
 body: {
    query: {
      match_all: {}
    }
  }    
}).then(function (body) {
  var hits = body.hits.hits;
}, function (error) {
  console.trace(error.message);
});


// serve up content and give it a default expiry
app.use(express.static(__dirname + '/public', { maxAge: oneDay }));

app.listen(process.env.PORT || 8080);
