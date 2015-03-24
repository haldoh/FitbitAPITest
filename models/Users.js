/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the FitbitAPITest project
 */

/*jslint node: true*/
"use strict";

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
	local:	{
		email:				String,
		name:					String,
		surname:			String,
		password:			String
	},
	fitbit:	{
		id:						String,
		token:				String,
		tokenSecret:	String,
		name:					String
	}
	
});

// generating a hash
UserSchema.methods.generateHash = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', UserSchema);
