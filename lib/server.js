var restify = require('restify');
var genericRessource = require('./generic-ressource');
var baseUrl = require('s-conf').require('base_url');

var server = module.exports = restify.createServer({
	name: "phoenixmusical-api",
	version: "0.0.0"
});

server.use(function(req, res, next){
	res.charSet('utf-8');
	req.user = {
		"id": "54ffa13f0adfefbc186e1652",
		"email": "frederic.gascon@gmail.com",
		"firstname": "Frédéric",
		"lastname": "Gascon"
	};
	next();
});

server.use(restify.bodyParser());

server.get('/', function(req, res){
	res.send({
		name: server.name,
		version: server.version
	});
});

//users
genericRessource({
	server: server,
	prefix: '/users',
	model: require('../models/user'),
	format: function(user){
		var href = baseUrl+"/users/"+user._id;
		return {
			_href: href,
			id: user._id,
			email: user.email,
			firstname: user.firstname,
			lastname: user.lastname
		};
	},
	update: function(user, req){
		var body = req.body;
		user.email = body.email;
		user.firstname = body.firstname;
		user.lastname = body.lastname;
	}
});

//comities
genericRessource({
	server: server,
	prefix: '/comities',
	model: require('../models/comity'),
	format: function(comity){
		var href = baseUrl+"/comities/"+comity._id;
		return {
			_href: href,
			id: comity._id,
			name: comity.name,
			_rels: {
				members: {
					_href: href+"/members"
				},
				posts: {
					_href: href+"/posts"
				}
			}
		};
	},
	update: function(comity, body){
		var body = req.body;
		comity.name = body.name;
	}
});
server.get('/comities/:comity/members', require('../routes/comities/members/list'));
server.post('/comities/:comity/members', require('../routes/comities/members/add'));
server.get('/comities/:comity/posts', require('../routes/comities/posts/list'));

//posts
genericRessource({
	server: server,
	prefix: '/posts',
	model: require('../models/post'),
	populate: function(query){
		return query.populate('comity').populate('creator');
	},
	format: function(post){
		return {
			_href: baseUrl+"/posts/"+post._id,
			id: post._id,
			name: post.name,
			creator: {
				_href: baseUrl+"/users/"+post.creator._id,
				id: post.creator._id,
				email: post.creator.email,
				firstname: post.creator.firstname,
				lastname: post.creator.lastname
			},
			comity: {
				_href: baseUrl+"/comities/"+post.comity._id,
				id: post.comity._id,
				name: post.comity.name
			},
			items: post.items.map(function(item){
				return {
					type: item.type,
					content: item.content,
					importance: item.importance,
					author: {
						_href: baseUrl+"/users/"+item.author,
						id: item.author
					}
				}
			})
		};
	},
	update: function(post, req){
		var body = req.body;
		post.name = body.name;
		post.comity = body.comity;
		post.creator = req.user.id;
	}
});
