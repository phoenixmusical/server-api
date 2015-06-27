var User = require('../models/user');
require('../lib/db');
var ask = require('./ask');

function die(message){
	console.error(message);
	process.exit(1);
}

var email = process.argv[3];
if(!email){
	die("You need to specify an e-mail");
}

var user;
User.findOne({
	email: email
})
	.exec()
	.then(function(u){
		user = u;
		if(!user){
			throw new Error("User not found");
		}
		return ask("Password: ");
	})
	.then(function(password){
		return user.setPassword(password);
	})
	.then(function(user){
		return user.save();
	})
	.then(function(){
		ask.done();
		process.exit(0);
	}, function(err){
		ask.done();
		die(err.message || err);
	});
