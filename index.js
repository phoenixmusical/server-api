var config = require('s-conf');
var debug = require('debug')('phoenixmusical:api');
var mongoose = require('mongoose');
var server = require('./lib/server');

mongoose.connect(config.require('db'));

server.listen(config.require('http_port'), config.get('http_host', '0.0.0.0'), function(){
	debug("%s listening at %s", server.name, server.url);
});