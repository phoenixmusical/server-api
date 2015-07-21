var findComity = require('../_find-comity');
var Event = require('../../../models/event');

module.exports = function(req, res, next){
	findComity(req)
		.then(function(comity){
			var event = new Event();
			event.name = req.body.name;
			event.description = req.body.description;
			event.start = req.body.start;
			event.end = req.body.end;
			event.comity = comity._id;
			event.creator = req.user._id;
			return event.save();
		})
		.then(function(){
			res.send({
				result: 'success'
			});
		}, next);
};
