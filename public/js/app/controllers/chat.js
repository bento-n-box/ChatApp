(function(RoomModel, Templates){
    var Chat = can.Control({
        
      init: function(element, options) {
          console.log('Chat Controller initialized', arguments);
          
      },
      
      "#outgoing keyup": function(textarea, event, data, room){
	      var user;
		  if(event.which==13){ 
		      var self = this;
		      message = textarea.val();	
		      if(!event.shiftKey ){	     
			      self.socket.emit('message', {room:this.room._id, message:message, from:this.options.user.displayName, source: 'incoming', avatar:this.options.user.avatar});
			      //var regex = /(\n|\r)/g;
			      this.element.find('#incoming').append(Templates["pages/partial.message.jade"]({message:message, source:'outgoing', from:'outgoing', avatar:this.options.user.avatar}));

			      textarea.val('');   
		      }    
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
      

      "route": function (data, room) {
      		   var self=this;
		      if(self.socket){
		        self.socket.emit('leave', {room:self.room._id, from:self.options.user.displayName});
		      }
		      RoomModel.findAll({}, function(rooms){ //.findAll is an ajax call to the back end
		        self.element.html(Templates["pages/partial.rooms.jade"]({rooms:rooms})); //renders html partial.rooms.jade
		      });
      			
      }, 
  
	   ":room_id route": function(data, room) {
		    var self = this; // Self points to controller
		    	
		    RoomModel.findOne({id: data.room_id}, function(room){
				
				self.room = room;	
				self.element.html(Templates["pages/partial.room.jade"]);
					
				if(!self.socket){
					self.socket = io.connect(window.location.origin); // points to root of current domain name url
					var source = 'incoming';
					self.socket.on('message', function(data){
						var regex = /(\n|\r)/g					     	
					  	self.element.find('#incoming').append(Templates["pages/partial.message.jade"](data));
					});
				}
				else{
					self.socket.socket.connect();					
				}
				self.socket.emit('join', {room:room._id, from:self.options.user.displayName, roomName:room.title});  
				
			});
	    }
    });
     
    window.Application.Controllers.Chat = Chat;
    
})(window.Application.Models.Room, window.Application.Templates);