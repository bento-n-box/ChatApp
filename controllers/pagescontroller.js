
var PagesController = {

	home: function(req, res){
		res.render('pages/home');
	},
	help: function(req, res){
		res.render('public/help');
	}
}

module.exports = PagesController;