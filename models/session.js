var restify = require('restify');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var SESSION_DURATION = 6 * 3600 * 1000;

var SessionSchema = new mongoose.Schema({
	user: {
		type: ObjectId,
		ref: 'User'
	},
	expiration: Number
});

SessionSchema.methods.touch = function(){
	this.expiration = Date.now() + SESSION_DURATION;
	return this;
};

var Session = module.exports = mongoose.model('Session', SessionSchema);

Session.findAndActivate = function(id){
	return Session.findById(id)
		.populate('user')
		.exec()
		.then(function(session){
			if(!session){
				throw new restify.UnauthorizedError("Session expired");
			}
			return session.touch().save();
		});
};
