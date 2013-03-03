var AuthController = {
	
	login: function (req, res) {
		res.render('auth/login', {title: "Please Login to Chat"})
	},
	logout: function (req, res){ // property that is read like json
		delete req.sessions.passport.user; //destroys session
		res.redirect('/login');// comes with express 	
	}

};

module.exports = AuthController;