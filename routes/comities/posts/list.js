var Post = require('../../../models/post');
var findComity = require('../_find-comity');

module.exports = function(req, res, next){
	findComity(req)
	    .then(function(comity){
	        return Post.find({
				comity: comity._id
			}).populate('creator').exec();
	    })
		.then(function(posts){
			res.send(posts.map(function(post){
			    return post.extractData();
			}));
		}, next)
		.end();
};
