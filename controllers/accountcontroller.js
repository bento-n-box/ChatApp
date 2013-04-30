var UserModel = require('../models/usermodel');

var AccountController = {

	show: function(req, res ){
		res.render('account/show', {user: req.session.user});
	},// Show
	
	update: function(req, res ){
		var image = req.files.image.path.split('/').pop();
		console.log(req.files);
		UserModel.findByIdAndUpdate(req.user._id, {avatar:image}, function(err, user){
			req.session.user = user;
			res.render('account/show', {user:user});
		});
		console.log(req.files);
	} // update funtion
	
};// Account Controller

module.exports = AccountController;