var  PagesController = require('../controllers/pagescontroller')
	,AuthController = require('../controllers/AuthController')
	,RoomController = require('../controllers/RoomController')
	,passport = require('passport')
	,express = require('express');

var verifyUser = function(req, res, next) { // middleware, next says go on to next funtion when done
		if (req.url.match('^/(stylesheets|js|images)')) return next();
		if (req.session.passport.user) return next(); // once funtion sees return it will no longer execute below
		res.redirect('/login'); 			
};


var route = function (app, user) {
// app.use registers middleware with every request
	//app.use(verifyUser);
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
	app.all('/*', verifyUser); 
	app.get('/', PagesController.home);
	
	app.get('/rooms', RoomController.index);
	app.get('/rooms/:id', RoomController.show);
	app.post('/rooms', RoomController.create);
	app.put('/rooms/:id', RoomController.update);
	app.delete('/rooms/:id', RoomController.delete);
	                                  
};

module.exports = route;
