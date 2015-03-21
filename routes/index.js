var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function(req, res){
	res.render('index', { user: req.user });
});

router.get('/account', ensureAuthenticated, function(req, res){
	res.render('account', { user: req.user });
});

router.get('/login', function(req, res){
	res.render('login', { user: req.user });
});

// GET /auth/fitbit
// Use passport.authenticate() as route middleware to authenticate the
// request. The first step in Fitbit authentication will involve redirecting
// the user to fitbit.com. After authorization, Fitbit will redirect the user
// back to this application at /auth/fitbit/callback
router.get('/auth/fitbit', passport.authenticate('fitbit'), function(req, res){
	// The request will be redirected to Fitbit for authentication, so this
	// function will not be called.
});

// GET /auth/fitbit/callback
// Use passport.authenticate() as route middleware to authenticate the
// request. If authentication fails, the user will be redirected back to the
// login page. Otherwise, the primary route function function will be called,
// which, in this example, will redirect the user to the home page.
router.get('/auth/fitbit/callback', passport.authenticate('fitbit', { failureRedirect: '/login' }), function(req, res) {
	res.redirect('/');
});

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

// Simple route middleware to ensure user is authenticated.
// Use this route middleware on any resource that needs to be protected. If
// the request is authenticated (typically via a persistent login session),
// the request will proceed. Otherwise, the user will be redirected to the
// login page.
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
		res.redirect('/login')
}

module.exports = router;
