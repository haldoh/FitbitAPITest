var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var passport = require('passport');
var util = require('util');
var FitbitStrategy = require('passport-fitbit').Strategy;

var FITBIT_CONSUMER_KEY = "c2e4152b68af4d4b9ba41134275cdff2"
var FITBIT_CONSUMER_SECRET = "ff3cc073d9ce47c38b73f9c1fda41bf8";

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: "Power of the dragonflame",
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(obj, done) {
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
		function(token, tokenSecret, profile, done) {
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

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
