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
var users = require('../controllers/users.js');

/* GET users listing. */
router.get('/', users.renderUsersList);

/* GET user's profile */
router.get('/account', users.isLoggedIn, users.renderUserProfile);

/* GET login page */
router.get('/login', users.isNotLoggedIn, users.renderLogin);

/* GET local signup page */
router.get('/signup', users.isNotLoggedIn, users.renderSignup);

/* POST local login */
router.post('/login', users.isNotLoggedIn, passport.authenticate('local-login', {
	successRedirect : '/',
	failureRedirect : '/users/login',
	failureFlash : true
}));

/* POST local signup */
router.post('/signup', users.isNotLoggedIn, passport.authenticate('local-signup', {
	successRedirect : '/',
	failureRedirect : '/users/signup',
	failureFlash : true
}));

// GET /auth/fitbit
// Use passport.authenticate() as route middleware to authenticate the
// request. The first step in Fitbit authentication will involve redirecting
// the user to fitbit.com. After authorization, Fitbit will redirect the user
// back to this application at /auth/fitbit/callback
router.get('/auth/fitbit', users.isLoggedIn, passport.authenticate('fitbit'), function (req, res) {
	// The request will be redirected to Fitbit for authentication, so this
	// function will not be called.
});

// GET /auth/fitbit/callback
// Use passport.authenticate() as route middleware to authenticate the
// request. If authentication fails, the user will be redirected back to the
// login page. Otherwise, the primary route function function will be called,
// which, in this example, will redirect the user to the home page.
router.get('/auth/fitbit/callback', passport.authenticate('fitbit', { failureRedirect: '/login' }), function (req, res) {
	res.redirect('/users/account');
});

/* Remove Fitbit association for the logged user */
router.get('/removefitbit', users.isLoggedIn, users.removeFitbit);

/* GET fitbit profile */
router.get('/fitbitprofile', users.isLoggedIn, users.getFitbitProfile);

/* logout */
router.get('/logout', users.isLoggedIn, users.logout);

module.exports = router;
