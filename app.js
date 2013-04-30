
/**
 * Module dependencies.
 */

var express = require('express')
  , route = require('./config/route')
  , http = require('http')
  , app = express()
  , path = require('path')
  , passport = require('passport')
  , mongoose =  require('mongoose')
  , mongoStore = require('connect-mongo')(express)
  ;

app.configure(function(){

  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname+"/public/images"}));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
 
  mongoose.connect('mongodb://localhost/chat_DEV');
  
  app.use(express.session({
		    secret: 'foo'
		  , store: new mongoStore({
		  			mongoose_connection: mongoose.connection, 
		  			db: 'chat_DEV'
		  			})
		  		})); // wire up sessions so mongo db remembers session and stores it
  app.use(passport.initialize()); 	// Needed for Passport in this location
  app.use(passport.session());		// Needed for Passport in this location
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, '/public')));
  
  app.locals.title = "NodeChat";
  app.use(function(req, res, next){
	  if (req.user){
	  	res.locals.user = req.user;
	  }
	  next();
  });
  
});



app.configure('development', function(){
  app.use(express.errorHandler());
  //mongoose.connect('mongodb://localhost/chat_DEV');
});

app.configure('production', function(){
  //app.use(express.errorHandler());
 // mongoose.connect('mongodb://localhost/chat_DEV');
});




passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});


var GoogleStrategy = require('passport-google').Strategy;
var UserModel = require('./models/usermodel');
passport.use(new GoogleStrategy({
    returnURL: 'http://localhost:3000/auth/google/return',
    realm: 'http://localhost:3000'
  },
  function(identifier, profile, done) {
	  profile.email = profile.emails[0].value;
	  UserModel.findOneAndUpdate({email:profile.email}, {$set:profile, $inc:{logins:1}}, {upsert:true}, done);
  }
));

route(app);
var server = http.createServer(app)
var io = require('socket.io').listen(server);
var RoomModel = require('./models/roommodel');

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

io.sockets.on('connection', function (socket) {
	
		socket.emit('message', {message: "Connected to Chat! ", from:"system",  avatar:"" });
					
		socket.on('join', function (data) {
		    RoomModel.findById(data.room, 'title', function(err, room){
		    	if(!err && data.room){
			    	socket.join(room._id);
				    socket.emit('message', {message:'Room: '+ room.title, from: 'system', source: 'system', avatar:"" });
				    socket.broadcast.to(data.room).emit('message', {message: data.from + ' has joined the room', from:'system', source: 'system', avatar:""});
				    
			    }
		    })
		});
		
		socket.on('message', function(data, room){
			  socket.broadcast.to(data.room).emit('message', data);
		});
		
});

	    

