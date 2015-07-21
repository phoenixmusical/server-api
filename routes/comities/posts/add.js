var findComity = require('../_find-comity');
var Post = require('../../../models/post');

module.exports = function(req, res, next){
	findComity(req)
		.then(function(comity){
			var post = new Post();
			post.name = req.body.name;
			post.comity = comity._id;
			post.creator = req.user._id;
			return post.save();
		})
		.then(function(){
			res.send({
				result: 'success'
			});
		}, next);
};
