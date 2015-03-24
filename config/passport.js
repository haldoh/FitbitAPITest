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

// TODO remove this
var env = process.env.NODE_ENV || 'local';
var config = require('./config.js')(env);

// And hide this
var FITBIT_CONSUMER_KEY = "c2e4152b68af4d4b9ba41134275cdff2";
var FITBIT_CONSUMER_SECRET = "ff3cc073d9ce47c38b73f9c1fda41bf8";

// Passport config
module.exports = function () {
	
	// Load User model
	var User = mongoose.model('User');
	
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});
	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
	
	/* LOCAL SIGNUP */
	passport.use('local-signup', new LocalStrategy({
		// use email as a username
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
	},
		function (req, email, password, done) {

			// asynchronous
			// User.findOne wont fire unless data is sent back
			process.nextTick(function () {

				// check if the user already exists
				User.findOne({ 'local.email' : email }, function (err, user) {
					// if there are any errors, return the error
					if (err) { return done(err); }

					// check to see if there is already a user with that email
					if (user) {
						return done(null, false, req.flash('signupMessage', 'Email already in use.'));
					} else {

						// if there is no user with that email create the user
						var newUser = new User();

						// set the user's local credentials
						newUser.local.email    = email;
						newUser.local.password = newUser.generateHash(password);
						newUser.local.name = req.body.name;
						newUser.local.surname = req.body.surname;

						// save the user
						newUser.save(function (err) {
							if (err) { throw err; }
							return done(null, newUser);
						});
					}
				});
			});
		}));
	
	/* LOCAL LOGIN */
	passport.use('local-login', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
	},
		function (req, email, password, done) { // callback with email and password from our form

			// check to see if the user exists
			User.findOne({ 'local.email' :  email }, function (err, user) {
				// if there are any errors, return the error
				if (err) { return done(err); }
				
				// if no user is found
				if (!user) { return done(null, false, req.flash('loginMessage', 'User not found.')); }

				// if the user is found but the password is wrong
				if (!user.validPassword(password)) { return done(null, false, req.flash('loginMessage', 'Wrong password.')); }

				// return user
				return done(null, user);
			});

		}));
	
	/* FITBIT LOGIN */
	passport.use(new FitbitStrategy({
		consumerKey: FITBIT_CONSUMER_KEY,
		consumerSecret: FITBIT_CONSUMER_SECRET,
		callbackURL: config.callbackURL,
		passReqToCallback: true
	},
		function (req, token, tokenSecret, profile, done) {
			
		// asynchronous verification, for effect...
			process.nextTick(function () {
				
				// associate the fitbit token with the logged user
				if (req.isAuthenticated()) {
					
					/*
					for (var prop in profile) {
						if (profile.hasOwnProperty(prop)) {
							console.log(prop + ": " + profile[prop]);
						}
					}
					*/
					
					// set information
					req.user.fitbit.id = profile.id;
					req.user.fitbit.token = token;
					req.user.fitbit.tokenSecret = tokenSecret;
					req.user.fitbit.name = profile.displayName;
					// save user data
					req.user.save(function (err) {
						if (err) { return done(err); }
						// return the user
						return done(null, req.user);
					});
				}
			});
		}));
};
