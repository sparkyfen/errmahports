var server = require('./server.js');

var App = function(){
	this.server = server;
}

exports.initialize = function() {
	server.start();
};
module.exports.App = App;