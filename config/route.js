var  PagesController = require('../controllers/pagescontroller')
	,AuthController = require('../controllers/AuthController')
	,passport = require('passport')
	,express = require('express');

var verifyUser = function(req, res, next) { // middleware, next says go on to next funtion when done
		
			if (req.session.passport.user) return next(); // once funtion sees return it will no longer execute below
			res.redirect('/login'); 			
};


var route = function (app, user) {

	app.get('/help', PagesController.help);
	app.get('/login', AuthController.login);
	app.get('/logout', AuthController.logout);
	
	// Redirect the user to Google for authentication.  When complete, Google
	// will redirect the user back to the application at
	//     /auth/google/return
		app.get('/auth/google', passport.authenticate('google'));
	
	// Google will redirect the user to this URL after authentication.  Finish
	// the process by verifying the assertion.  If valid, the user will be
	// logged in.  Otherwise, authentication has failed.
	app.get('/auth/google/return', 
	  passport.authenticate('google', { successRedirect: '/',
	                                    failureRedirect: '/login' }));
	                                    
	// Pages that require Login below
	app.all('*', verifyUser); 
	app.get('/', PagesController.home);
	                                  
};

module.exports = route;
