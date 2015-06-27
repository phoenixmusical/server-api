var User = require('../models/user');
require('../lib/db');
var ask = require('./ask');

function die(message){
	console.error(message);
	process.exit(1);
}

var user = new User();

ask("email: ")
	.then(function(email){
		user.email = email;
		return ask("firstname: ");
	})
	.then(function(firstname){
		user.firstname = firstname;
		return ask("lastname: ");
	})
	.then(function(lastname){
		user.lastname = lastname;
		return ask("role: ");
	})
	.then(function(role){
		user.role = role;
		return ask("password: ");
	})
	.then(function(password){
		return user.setPassword(password);
	})
	.then(function(){
		return user.save();
	})
	.then(function(){
		ask.done();
		console.log("User created");
		process.exit(0);
	}, function(err){
		ask.done();
		die(err.message || err);
	});
