(function(){
	
	window.Application = can.Construct({
		//Static properties
		//instances of created on fuction themselves
		Models: {},
		Controllers: {},
		boot: function(data){
			new window.Application.Controllers.Chat('#main', data);
			
		}
		
	},{
		// Instance of prototype properties 
		//instances created of new application
		
	});
	
})();