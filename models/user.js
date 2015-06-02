var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	email: String,
	firstname: String,
	lastname: String,
	role: String,
	local: {
		passhash: String
	}
});

UserSchema.methods.setPassword = function(password, callback){
	var self = this;
    bcrypt.hash(password, null, null, function(err, hash){
    	if(err){
    		return callback(err);
    	}
    	self.local.passhash = hash;
    	callback();
    });
};

UserSchema.methods.validatePassword = function(password, callback){
    return bcrypt.compare(password, this.local.passhash, callback);
};

module.exports = mongoose.model('User', UserSchema);
