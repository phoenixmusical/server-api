var restify = require('restify');
var auth = require('./auth');

module.exports = function(options){
	var server = options.server;
	var prefix = options.prefix;
	var Model = options.model;
	var notFound = options.notFound || function(callback){
		return callback(new restify.NotFoundError("Not found"));
	};
	var populate = options.populate || function(query){
		return query;
	};
	
	function findById(req, callback){
		populate(Model.findById(req.params.id))
			.exec(function(err, model){
				if(err){
					return callback(err);
				}
				if(!model){
					return notFound(callback);
				}
				callback(null, model);
			});
	}
	
	server.get(prefix, auth, function list(req, res, next){
		populate(Model.find()).exec(function(err, models){
			if(err){
				return next(err);
			}
			res.send(models.map(options.format));
		});
	});
	
	server.post(prefix, auth, function create(req, res, next){
		var model = new Model();
		try{
			options.update(model, req);
		}catch(err){
			return next(err);
		}
		model.save().then(function(){
			res.send(options.format(model));
		}, next);
	});
	
	server.get(prefix+'/:id', auth, function get(req, res, next){
		findById(req, function(err, model){
			if(err){
				return next(err);
			}
			res.send(options.format(model));
		});
	});
	
	server.post(prefix+'/:id', auth, function get(req, res, next){
		findById(req, function(err, model){
			if(err){
				return next(err);
			}
			try{
				options.update(model, req);
			}catch(err){
				return next(err);
			}
			model.save().then(function(){
				res.send(options.format(model));
			}, next);
		});
	});
	
	server.del(prefix+'/:id', auth, function get(req, res, next){
		findById(req, function(err, model){
			if(err){
				return next(err);
			}
			model.remove(function(err){
				if(err){
					return next(err);
				}
				res.send({
					result: 'success'
				});
			});
		});
	});
};