var baseUrl = require('s-conf').require('base_url');

module.exports = function(req, res, next){
	var user = req.user;
	if(!user){
		return next(new Error("User not found"));
	}
	res.send({
		_href: baseUrl+'/users/'+user._id,
		email: user.email,
		firstname: user.firstname,
		lastname: user.lastname,
		role: user.role
	});
};