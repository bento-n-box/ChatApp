(function () {
    
    var Chat = can.Control({
        
      init: function(element, options) {
          console.log('Chat Controller initialized', arguments);
          
      },
      
      "form submit": function(form, event){
            event.preventDefault(); 
            var title = $(form).children('input[type="text"]').val();
            var Room = new window.Application.Models.Room({title:title});
            Room.save(function(room){
                console.log(room);
            });
      },
      
      "route": function () {
        var self = this;
          window.Application.Models.Room.findAll({}, function(rooms){
            
            self.element.html(window.templates["pages/partial.rooms.jade"]({rooms:rooms}));
          
          });
      } 
        
    });
    window.Application.Controllers.Chat = Chat;
})();