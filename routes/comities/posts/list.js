var Comity = require('../../../models/comity');
var Post = require('../../../models/post');
var baseUrl = require('s-conf').require('base_url');

module.exports = function(req, res, next){
	var comity;
	Comity.findById(req.params.comity)
		.exec()
		.then(function(c){
			comity = c;
			if(!comity){
				throw new Error("Comity not found");
			}
			return Post.find({
				comity: comity._id
			}).populate('creator').exec();
		})
		.then(function(posts){
			var postsBaseUrl = baseUrl+'/comities/'+comity._id+'/posts/';
			res.send(posts.map(function(post){
				var creator = post.creator;
				return {
					_href: postsBaseUrl+post._id,
					id: post._id,
					name: post.name,
					creator: creator ? {
						_href: baseUrl+'/users/'+creator._id,
						id: creator._id,
						email: creator.email,
						firstname: creator.firstname,
						lastname: creator.lastname,
					} : null
				};
			}));
		}, next)
		.end();
};
