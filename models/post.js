var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var baseUrl = require('s-conf').require('base_url');

var PostSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true
	},
	comity: {
		type: ObjectId,
		ref: 'Comity'
	},
	creator: {
		type: ObjectId,
		ref: 'User'
	},
	date: {
		type: Date,
		'default': Date.now
	},
	items: [{
		item_type: String,
		content: String,
		importance: Number,
		author: {
			type: ObjectId,
			ref: 'User'
		}
	}]
});

PostSchema.methods.extractData = function(){
	var creator = this.creator;
	return {
		_href: baseUrl+'/comities/'+this.comity+'/posts/'+this._id,
		id: this._id,
		name: this.name,
		creator: creator ? {
			_href: baseUrl+'/users/'+creator._id,
			id: creator._id,
			email: creator.email,
			firstname: creator.firstname,
			lastname: creator.lastname,
		} : null
	};
};

module.exports = mongoose.model('Post', PostSchema);
