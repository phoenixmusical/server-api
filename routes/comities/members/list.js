var Comity = require('../../../models/comity');

module.exports = function(req, res, next){
	Comity.findById(req.params.id)
		.populate('members')
		.exec()
		.then(function(comity){
			res.send(comity.members.map(function(member){
				return {
					id: member._id,
					email: member.email,
					firstname: member.firstname,
					lastname: member.lastname
				};
			}));
		}, next);
};