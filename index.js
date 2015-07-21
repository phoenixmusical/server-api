var config = require('s-conf');
var mongoose = require('mongoose');
var debug = require('debug')('phoenixmusical:api');
var server = require('./lib/server');

mongoose.connect(config.require('db'));

server.listen(config.get('http_port', process.env.PORT), config.get('http_host', process.env.IP||'0.0.0.0'), function(){
	debug("%s listening at %s", server.name, server.url);
});
