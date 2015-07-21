var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Q = require('q');
var baseUrl = require('s-conf').require('base_url');

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
    	deferred.resolve(self);
    });
    return deferred.promise;
};

UserSchema.methods.validatePassword = function(password){
	var deferred = Q.defer();
    bcrypt.compare(password, this.local.passhash, deferred.makeNodeResolver());
    return deferred.promise;
};

UserSchema.methods.extractData = function(){
	var href = baseUrl+"/users/"+this._id;
	return {
		_href: href,
		id: this._id,
		email: this.email,
		firstname: this.firstname,
		lastname: this.lastname,
		role: this.role
	};
};

module.exports = mongoose.model('User', UserSchema);
