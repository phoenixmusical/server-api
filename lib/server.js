var restify = require('restify');
var genericRessource = require('./generic-ressource');

var server = module.exports = restify.createServer({
	name: "phoenixmusical-api",
	version: "0.0.0"
});

server.use(function(req, res, next){
	res.charSet('utf-8');
	next();
});

server.use(restify.bodyParser());

server.get('/', function(req, res){
	res.send({
		name: app.name,
		version: app.version
	});
});

//users
genericRessource({
	server: server,
	prefix: '/users',
	model: require('../models/user'),
	format: function(user){
		return {
			id: user._id,
			email: user.email,
			firstname: user.firstname,
			lastname: user.lastname
		};
	},
	update: function(user, body){
		user.email = body.email;
		user.firstname = body.firstname;
		user.lastname = body.lastname;
	}
});

//comity
genericRessource({
	server: server,
	prefix: '/comities',
	model: require('../models/comity'),
	format: function(comity){
		return {
			id: comity._id,
			name: comity.name
		};
	},
	update: function(comity, body){
		comity.name = body.name;
	}
});
server.get('/comities/:id/members', require('../routes/comities/members/list'));
server.post('/comities/:id/members', require('../routes/comities/members/add'));
