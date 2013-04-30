var AuthController = {
	
	login: function (req, res) {
		res.render('auth/login')
	},
	logout: function (req, res){ // property that is read like json
		req.logOut();
		res.redirect('/login');
		
	},
	account: function (req, res){
		res.render('account');
	}

};

module.exports = AuthController;