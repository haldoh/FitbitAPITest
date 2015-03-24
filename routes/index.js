/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the FitbitAPITest project
 */

/*jslint node:true*/
/*jslint nomen:true*/
"use strict";

var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function (req, res) {
	res.render('index', { user: req.user });
});

module.exports = router;
