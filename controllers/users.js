/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the FitbitAPITest project
 */

/*jslint node:true*/
"use strict";

// requires
var User = require('mongoose').model('User');
var request = require('request');

var baseFitbitURL = 'https://api.fitbit.com';

// Check if a user is logged in before using certain routes
module.exports.isLoggedIn = function (req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/');
};

// Check if a user is NOT logged in before using certain other routes
module.exports.isNotLoggedIn = function (req, res, next) {
	if (!req.isAuthenticated()) { return next(); }
	res.redirect('/');
};

// Get this user's fitbit profile
module.exports.getFitbitProfile = function (req, res, next) {
	var oauth = {
		consumer_key: 'c2e4152b68af4d4b9ba41134275cdff2',
		consumer_secret: 'ff3cc073d9ce47c38b73f9c1fda41bf8',
		token: req.user.fitbit.token,
		token_secret: req.user.fitbit.tokenSecret
	},
		url = baseFitbitURL + '/1/user/-/profile.json';
	request.get({url: url, oauth: oauth, json: true}, function (e, resp, data) {
		res.send(JSON.stringify(data));
	});
};

// Remove associated fitbit data from the user
module.exports.removeFitbit = function (req, res, next) {
	req.user.fitbit.id = undefined;
	req.user.fitbit.token = undefined;
	req.user.fitbit.name = undefined;
	req.user.save(function (err) {
		if (err) { return next(err); }
		res.redirect('/users/account');
	});
};

// Logout a user
module.exports.logout = function (req, res, next) {
	req.logout();
	res.redirect('/');
};

// Render login page
module.exports.renderLogin = function (req, res, next) {
	res.render('login', { title: 'login', errors: req.flash('error') });
};

// Render signup page
module.exports.renderSignup = function (req, res, next) {
	res.render('signup', { title: 'Sign up', errors: req.flash('error') });
};

// Render a list of users
module.exports.renderUsersList = function (req, res, next) {
	// TODO
	res.send('respond with a resource');
};

// Render a user profile
module.exports.renderUserProfile = function (req, res, next) {
	res.render('account', { title: 'Profile', user: req.user });
};