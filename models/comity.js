var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var baseUrl = require('s-conf').require('base_url');

var ComitySchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true
	},
	description: String,
	members: [{
		type: ObjectId,
		ref: 'User'
	}]
});

ComitySchema.methods.extractData = function(){
	var href = baseUrl+"/comities/"+this._id;
	return {
		_href: href,
		id: this._id,
		name: this.name,
		description: this.description,
		_rels: {
			members: {
				_href: href+"/members"
			},
			posts: {
				_href: href+"/posts"
			},
			events: {
				_href: href+"/events"
			}
		}
	};
};

module.exports = mongoose.model('Comity', ComitySchema);
