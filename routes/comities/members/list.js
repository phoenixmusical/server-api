var Comity = require('../../../models/comity');
var baseUrl = require('s-conf').require('base_url');

module.exports = function(req, res, next){
	Comity.findById(req.params.comity)
		.populate('members')
		.exec()
		.then(function(comity){
			res.send(comity.members.map(function(member){
				return {
					_href: baseUrl+"/users/"+member._id,
					id: member._id,
					email: member.email,
					firstname: member.firstname,
					lastname: member.lastname
				};
			}));
		}, next);
};