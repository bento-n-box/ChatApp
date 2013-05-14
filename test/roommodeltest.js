var RoomModel = require('../models/RoomModel'),
	should = require('should'),
	mongoose =  require('mongoose')
	;
	
before(function(done){
	if (mongoose.connection.db){
		return done();
	}
	mongoose.connect('mongodb://localhost/chat_TEST', done);
});

describe('RoomModel', function (){
	
	it('should exist', function (){
		should.exist(RoomModel)		
	});
	
	it('should be an function', function (){
		RoomModel.should.be.a('function');
	});
	
	it('allows instantiations of models as discreet entities', function (){
		var Room = new RoomModel(),
			RoomB = new RoomModel(); // create two seperate instances
			
		Room.should.be.an.instanceof(RoomModel);
		RoomB.should.be.an.instanceof(RoomModel); // prove that each one is a instance of a Model
		
		should.equal(Room === RoomB, false); // prove that each instance is discreet
	});
	
	it('should save a record', function(done){
		var Room = new RoomModel();
		Room.title = 'Room 1';
		Room.save(function (err, docs) {
			should.equal(err, null); // prove we have no errors
			docs.should.be.a('object').and.have.property('title');
			docs.should.have.property('_id');
			done();
		});
	});
	
	describe('find()', function () {
		it('should return array of documents', function (done) { 
			RoomModel.find({},function (err, docs) {
				
				should.equal(err, null); //prove there are erros
				
				docs.should.be.an.instanceOf(Array).and.not.be.empty; // prove we have an array
				
				done();
			})
			
		});
	});

	
});
