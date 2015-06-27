var Comity = require('../../../models/comity');
var Post = require('../../../models/post');

module.exports = function(req, res, next){
	var post;
	Comity.findById(req.params.comity)
		.populate('posts')
		.exec()
		.then(function(c){
			comity = c;
			if(!comity){
				throw new Error("Comity not found");
			}
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
