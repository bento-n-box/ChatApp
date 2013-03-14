(function(RoomModel, Templates){
    var Chat = can.Control({
        
      init: function(element, options) {
          console.log('Chat Controller initialized', arguments);
          
      },
      
      "#outgoing keyup": function(textarea, event, data, room){
	     	var self = this;
	      if(!event.shiftKey && event.which==13){
		      var dialogue = textarea.val();
		      self.socket.emit('dialogue', {room:room, dialogue:textarea.val(), from:this.options.user.displayName});
		      this.element.find('#incoming').append('<pre class="user">Me: '+ dialogue+'</pre>');
		      textarea.val('');   
		      console.log('step 1');
	      }
      },
      
      

      "form submit": function (form, event) {      	
      	event.preventDefault();
      	var title = $(form).children('input[type="text"]').val();
      	var Room = new RoomModel({title:title});
      	Room.save(function (room) {
      		//can.route.attr({room_id: room._id})
      		window.location.hash = '#!'+room._id;
      	});
      },

      "route": function () {
      	var self = this;
      	RoomModel.findAll({}, function (rooms) {
      		self.element.html(Templates["pages/partial.rooms.jade"]({rooms:rooms}));
      	});	
      },          
       
	   ":room_id route": function(data, room) {
		    var self = this; // Self points to controller
		    
		    RoomModel.findOne({id:data.room_id}, function(room){
			  self.room = room;
			  
			  self.element.html(Templates["pages/partial.room.jade"]);
			  self.socket = io.connect(window.location.origin); // points to root of current domain name url
			  self.socket.emit('join', {room:room._data.title, from:self.options.user.displayName, room_name:room._data.title});  
			  
			  
			  self.socket.on('message', function(data){
				   self.element.find('#incoming').append('<p class="system">' + data.message +'</p>');
			   });
			  self.socket.on('dialogue', function(data){
				   self.element.find('#incoming').append('<p class="buddy">' + self.options.user.displayName + ": "+ data.dialogue +'</p>');
				   console.log('step 3');
			   });
		    })
	    }
    });
     
    window.Application.Controllers.Chat = Chat;
    
})(window.Application.Models.Room, window.Application.Templates);