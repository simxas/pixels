// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;

var morgan       = require('morgan');

var path = require('path');


app.use(express.static(path.join(__dirname, '/')));

app.set('view engine', 'ejs'); // set up ejs for templating


app.listen(port);
console.log('The magic happens on port ' + port);