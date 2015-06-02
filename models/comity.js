var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var ComitySchema = new mongoose.Schema({
	name: String,
	members: [{
		type: ObjectId,
		ref: 'User'
	}]
});

module.exports = mongoose.model('Comity', ComitySchema);
