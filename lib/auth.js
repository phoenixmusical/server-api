var restify = require('restify');
var ObjectId = require('mongoose').Types.ObjectId;
var Session = require('../models/session');

module.exports = function(req, res, next){
	var token = req.header('X-Token');
	if(!token){
		return next(new restify.UnauthorizedError());
	}
	if(!ObjectId.isValid(token)){
		return next(new restify.InvalidArgumentError("Invalid X-Token"));
	}
	Session.findAndActivate(token)
		.then(function(session){
			req.user = session.user;
			next();
		}, next);
};