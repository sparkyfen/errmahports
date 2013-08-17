//Express JS for HTTP
var express = require('express')
  , http = require('http')
  , path = require('path')
  , qs = require('querystring')
  , helmet = require('helmet')
  , Scanner = require('../scanner.js')
  , settings = require('../settings.js');
var app = express();
var Server = function() {}

/**
 * Starts the node server
 */
exports.start = function() {
	var serverPort = settings.server.serverPort;
	app.configure(function () {
		app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "localhost");
		app.set('port', process.env.OPENSHIFT_NODEJS_PORT || serverPort);
		app.set('views', __dirname + '/views');
		app.use(express.favicon());
		app.use(express.logger('dev'));
		app.use(helmet.csp());
		app.use(helmet.xframe());
		app.use(helmet.contentTypeOptions());
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(app.router);
		app.use(express.static(path.join(__dirname, 'public')));
	});
	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}
	this.createGets();
	http.createServer(app).listen(app.get('port'), app.get('ip'), function(){
	  console.log('Express server listening on ip:' + app.get('ip') + ' port:' + app.get('port'));
	});
};

/**
 * Stops the node server for whatever reason
 */
exports.stop = function() {
	//TODO stop the server
	console.log("Server has stopped.");
};

/**
 * Creates the GET calls that we will allow by the API
 */
exports.createGets = function() {
	app.get('/', function (request, response) {
		response.send('This is the API Service for ErrMahPorts.');
	});
	/**
	 * Request: /scan?host=192.168.0.1&ports=80&ports=443
	 */
	app.get('/scan', function (request, response) {
		Scanner.scanHost(request, function (error, data) {
			if(error) {
				response.json(500, error);
			}
			response.json(data);
		});
	});
	app.get('/status', function (request, response) {
		Scanner.status(request, function (error, data) {
			if(error) {
				response.json(500, {message: error});
			}
			response.json(data);
		});
	});
};
return Server;