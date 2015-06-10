var restify = require('restify');
var User = require('../../models/user');
var Session = require('../../models/session');
var baseUrl = require('s-conf').require('base_url');

function validatePassword(user, password){
	return user.validatePassword(password)
		.then(function(isValid){
			if(!isValid){
				throw new restify.InvalidCredentialsError();
			}
			return user;
		});
}

module.exports = function(req, res, next){
	var body = req.body;
	User.findOne({
		email: body.email
	})
		.exec()
		.then(function(user){
			if(!user){
				throw new restify.InvalidCredentialsError();
			}
			return validatePassword(user, body.password);
		})
		.then(function(user){
			var session = new Session();
			session.user = user._id;
			session.touch();
			return session.save().then(function(){
				return {
					id: session._id,
					user: {
						_href: baseUrl+'/users/'+user._id,
						email: user.email,
						firstname: user.firstname,
						lastname: user.lastname,
						role: user.role
					},
					expiration: session.expiration
				};
			});
		})
		.then(function(result){
			res.send(result);
		}, next);
};