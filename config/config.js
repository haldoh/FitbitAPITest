/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the FitbitAPITest project
 */

/*jslint node:  true */
/*jslint nomen: true */
"use strict";

var config = {

	local: {
		mode: 'local',
		port: 5000,
		securePort: 5001,
		callbackURL: 'http://192.168.0.9:3000/users/auth/fitbit/callback',
		mongo: {
			host: 'localhost',
			port: 27017,
			name: 'FBAPITest',
			sessionName: 'sessionFBAPITest'
		}
	},
	
	heroku: {
		mode: 'heroku',
		port: process.env.PORT,
		securePort: process.env.PORT,
		callbackURL: 'https://fitbitapitest.herokuapp.com/users/auth/fitbit/callback',
		mongo: {
			host: process.env.MUSER + ":" + process.env.MPWD + "@ds039291.mongolab.com",
			port: 39291,
			name: 'heroku_app35094329',
			sessionName: 'heroku_app35094329'
		}
	},
	
	production: {
		mode: 'production',
		port: 80,
		securePort: 443,
		adminName: 'admin',
		adminPwd: 'password',
		mongo: {
			host: '127.0.0.1',
			port: 27017,
			name: 'FBAPITest',
			sessionName: 'sessionFBAPITest'
		}
	}
};

module.exports = function (mode) {
	return config[mode || process.argv[2] || 'local'] || config.local;
};