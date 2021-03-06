/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the p2peers project
 */

/*jslint node:true*/
/*jslint nomen:true*/
"use strict";

// requires
var mongoose = require('./config/mongoose.js');
var express = require('./config/express.js');
var passport = require('./config/passport.js');

// Connect to db
var db = mongoose();

// Create app
var app = express();

// Configure passport
var passport = passport();

// http server
var http = require('http').Server(app);

module.exports = app;