var restify = require('restify');
var User = require('../../models/user');
var Session = require('../../models/session');

module.exports = function(req, res, next){
	var token = req.header('X-Token');
	if(!token){
		return next(new restify.BadRequestError("X-Token missing"));
	}
	Session.findById(token)
		.then(function(session){
			if(session){
				return session.remove();
			}
		})
		.then(function(){
			res.send({
				result: 'success'
			});
		}, next);
};