var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var PostSchema = new mongoose.Schema({
	name: String,
	comity: {
		type: ObjectId,
		ref: 'Comity'
	},
	creator: {
		type: ObjectId,
		ref: 'User'
	},
	items: [{
		type: String,
		content: String,
		importance: Number,
		author: {
			type: ObjectId,
			ref: 'User'
		}
	}]
});

module.exports = mongoose.model('Post', PostSchema);
