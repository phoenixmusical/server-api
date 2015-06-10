var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Q = require('q');

var UserSchema = new mongoose.Schema({
	email: String,
	firstname: String,
	lastname: String,
	role: String,
	local: {
		passhash: String
	}
});

UserSchema.methods.setPassword = function(password){
	var self = this;
	var deferred = Q.defer();
    bcrypt.hash(password, null, null, function(err, hash){
    	if(err){
    		return deferred.reject(err);
    	}
    	self.local.passhash = hash;
    	deferred.resolve();
    });
    return deferred.promise;
};

UserSchema.methods.validatePassword = function(password){
	var deferred = Q.defer();
    bcrypt.compare(password, this.local.passhash, deferred.makeNodeResolver());
    return deferred.promise;
};

module.exports = mongoose.model('User', UserSchema);
