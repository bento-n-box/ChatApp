var UserModel = require('../models/usermodel'),
	should = require('should'),
	mongoose =  require('mongoose')
	;

before(function(done){
	if (mongoose.connection.db){
		return done();
	}
	mongoose.connect('mongodb://localhost/chat_TEST', done);
});


describe('UserModel', function (){
	
	before(function (done) {
		UserModel.create({email: 'test@test.com', name: { familyName: "firstName", lastName: "lastName"} }, done);
	});
	after(function (done){
		UserModel.remove({email:'test@test.com'}, done);
	});


	describe('fullname()', function () {
		
		it('should return a users full name', function (done) {
			
			UserModel.findOne({email:"test@test.com"}, function(err, doc){
				doc.should.be.an.instanceof(UserModel);
				doc.fullname.should.be.a('function'); // prove we have a function
				should.equal(doc.fullname(), 'firstName lastName');
		
				done();	
				
			});
						
		});	
	});
	
	describe('findByEmail()', function () {
	
		it('should return a single document found by the email', function (done) {
		
			UserModel.findByEmail.should.be.a('function');
			
			UserModel.findByEmail('test@test.com', function (err, doc) {
				
				should.equal(err, null);

				doc.should.be.an.instanceof(UserModel);
				doc.should.have.property('email','test@test.com');

				
				done();
			});
			
		});
		
	});
	
	
		
});