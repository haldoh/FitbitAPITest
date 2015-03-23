/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the FitbitAPITest project
 */

/*jslint node:true*/
/*jslint nomen:true*/
"use strict";

// requires
var passport = require('passport');
var mongoose = require('mongoose');
var util = require('util');
var LocalStrategy = require('passport-local').Strategy;
var FitbitStrategy = require('passport-fitbit').Strategy;

var FITBIT_CONSUMER_KEY = "c2e4152b68af4d4b9ba41134275cdff2";
var FITBIT_CONSUMER_SECRET = "ff3cc073d9ce47c38b73f9c1fda41bf8";

// Passport config
module.exports = function () {
	
	// Load User model
	var User = mongoose.model('User');
	
	passport.serializeUser(function (user, done) {
		done(null, user);
	});
	passport.deserializeUser(function (obj, done) {
		done(null, obj);
	});
	
	// Use the FitbitStrategy within Passport.
	// Strategies in passport require a `verify` function, which accept
	// credentials (in this case, a token, tokenSecret, and Fitbit profile), and
	// invoke a callback with a user object.
	passport.use(new FitbitStrategy({
		consumerKey: FITBIT_CONSUMER_KEY,
		consumerSecret: FITBIT_CONSUMER_SECRET,
		callbackURL: "http://192.168.0.9:3000/auth/fitbit/callback"
	},
		function (token, tokenSecret, profile, done) {
			// asynchronous verification, for effect...
			process.nextTick(function () {
				// To keep the example simple, the user's Fitbit profile is returned to
				// represent the logged-in user. In a typical application, you would want
				// to associate the Fitbit account with a user record in your database,
				// and return that user instead.
				return done(null, profile);
			});
		}
		));
};
