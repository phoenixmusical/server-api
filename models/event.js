var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var baseUrl = require('s-conf').require('base_url');

var EventSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true
	},
	description: String,
	start: Number,
	end: Number,
	comity: {
		type: ObjectId,
		ref: 'Comity'
	},
	creator: {
		type: ObjectId,
		ref: 'User'
	}
});

/*EventSchema.virtual('duration').get(function(){
    return this.end - this.start;
});*/

EventSchema.methods.extractData = function(){
	var creator = this.creator;
	return {
		_href: baseUrl+'/comities/'+this.comity+'/events/'+this._id,
		id: this._id,
		name: this.name,
		description: this.description,
		start: this.start,
		end: this.end,
		creator: creator ? {
			_href: baseUrl+'/users/'+creator._id,
			id: creator._id,
			email: creator.email,
			firstname: creator.firstname,
			lastname: creator.lastname,
		} : null
	};
};

module.exports = mongoose.model('Event', EventSchema);
