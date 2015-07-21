var restify = require('restify');
var corsMiddleware = require('restify-cors-middleware');
var genericRessource = require('./generic-ressource');
var auth = require('./auth');
var config = require('s-conf');

var baseUrl = config.require('base_url');

var server = module.exports = restify.createServer({
	name: "phoenixmusical-api",
	version: "0.0.0"
});

var throttleConfig = {
	burst: 75,
	rate: 40
};
if(config.get('behind_proxy')){
	throttleConfig.xff = true;
}else{
	throttleConfig.ip = true;
}
server.use(restify.throttle(throttleConfig));

var allowOrigins = config.get('allow_origins');
if(allowOrigins){
	var cors = corsMiddleware({
		origins: allowOrigins,
		allowHeaders: ['X-Token']
	});
	server.pre(cors.preflight);
	server.use(cors.actual);
}

server.use(function(req, res, next){
	res.charSet('utf-8');
	next();
});

server.use(restify.bodyParser());

server.get('/', function(req, res){
	res.send({
		name: server.name,
		version: server.version
	});
});

server.get('/auth/whoami', auth, require('../routes/auth/whoami'));
server.post('/auth/login', require('../routes/auth/login'));
server.post('/auth/logout', require('../routes/auth/logout'));

//users
genericRessource({
	server: server,
	prefix: '/users',
	model: require('../models/user'),
	update: function(user, req){
		var body = req.body;
		var isAdmin = req.user.role === 'admin';
		if(!isAdmin && req.user._id != user.id){
			throw new restify.ForbiddenError("You are not allowed to modify this user.");
		}
		user.email = body.email;
		user.firstname = body.firstname;
		user.lastname = body.lastname;
		if(isAdmin && body.role){
			user.role = body.role;
		}
	}
});

//comities
genericRessource({
	server: server,
	prefix: '/comities',
	model: require('../models/comity'),
	update: function(comity, req){
		var body = req.body;
		comity.name = body.name;
		comity.description = body.description;
	}
});
server.get('/comities/:comity/members', auth, require('../routes/comities/members/list'));
server.post('/comities/:comity/members', auth, require('../routes/comities/members/add'));
server.get('/comities/:comity/posts', auth, require('../routes/comities/posts/list'));
server.post('/comities/:comity/posts', auth, require('../routes/comities/posts/add'));
server.get('/comities/:comity/events', auth, require('../routes/comities/events/list'));

//posts
/*genericRessource({
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
*/