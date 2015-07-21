var Event = require('../../../models/event');
var findComity = require('../_find-comity');

module.exports = function(req, res, next){
	findComity(req)
	    .then(function(comity){
	        return Event.find({
				comity: comity._id
			}).populate('creator').exec();
	    })
		.then(function(events){
			res.send(events.map(function(event){
			    return event.extractData();
			}));
		}, next)
		.end();
};
