var readline = require('readline');
var Q = require('q');

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function ask(prompt){
	var deferred = Q.defer();
	rl.question(prompt, function(resp){
		deferred.resolve(resp);
	});
	return deferred.promise;
}

ask.done = function(){
	rl.close();
};

module.exports = ask;
