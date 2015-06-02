var Comity = require('../../../models/comity');
var User = require('../../../models/user');

module.exports = function(req, res, next){
	var comity;
	Comity.findById(req.params.comity)
		.populate('members')
		.exec()
		.then(function(c){
			comity = c;
			if(!comity){
				throw new Error("Comity not found");
			}
			return User.findById(req.body.id).exec();
		})
		.then(function(user){
			if(!user){
				throw new Error("User not found");
			}
			comity.members.push(user);
			return comity.save();
		})
		.then(function(){
			res.send({
				result: 'success'
			});
		}, next);
};