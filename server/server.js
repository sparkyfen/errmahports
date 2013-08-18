//Express JS for HTTP
var express = require('express');
var qs = require('querystring');
var https = require('https');
var settings = require('../settings.js');
var helmet = require('helmet');
var uuid = require('node-uuid');
var Scanner = require('../scanner.js');
var sqs = require('../sqs.js');
var s3 = require('../s3.js');
var utils = require('../utils.js');
var app = express();
var Server = function() {}

/**
 * Starts the node server
 */
exports.start = function() {
	var sslPort = settings.server.sslPort;
	var serverPort = settings.server.serverPort;
	var sslOptions = settings.server.sslOptions;
	if(sslPort === '' || serverPort === '' || sslOptions === '') {
		throw new ReferenceError('Missing server settings, please edit the settings file.');
	}
	app.configure(function () {
		app.set('title', 'ErrMahPorts');
		app.use(express.methodOverride());
		app.use(helmet.csp());
		app.use(helmet.xframe());
		app.use(helmet.contentTypeOptions());
		app.use(app.router);
	});
	this.createGets();
	if(sslOptions.key === null || sslOptions.cert === null) {
		http.createServer(app).listen(serverPort, function () {
			console.log("IT IS ADVISED THAT YOU RUN YOUR SERVER ON HTTPS!");
			console.log("Server has started on port " + serverPort);
		});
	} else {
		https.createServer(sslOptions, app).listen(sslPort, function () {
			console.log("Server has started on port " + sslPort);
		});
	}
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
		// Create UUID for unique key
		var UUID = uuid.v4();
		// Process data to forumulate into queue object
		processSQSData(request, UUID, function (error, sqsObj) {
			if(error) {
				response.json(500, {message: error});
			}
			// Store message in SQS
			sqs.storeMessage(sqsObj, function (error, data) {
				if(error) {
					response.json(500, {message: error});
				}
			});
		});

		var s3Obj = processS3Data(request);
		s3.storeRequest(s3Obj, UUID, function (error, data) {
			if(error) {
				response.json(500, {message: error});
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

function processSQSData(request, UUID, callback) {
	try {
		// TODO expand to check to isURL or isIPV6Address
		var host = utils.checkInput(utils.sanitizeInput(request.query.host, 'string'), 'IPv4');
		var ports = request.query.ports;
		var sqsSchema = require('../sqsSchema.json');
		sqsSchema.uuid = UUID;
		sqsSchema.input.host = host;
		sqsSchema.input.ports = ports;
		return callback(null, sqsSchema);
	} catch(e) {
		return callback(e.message);
	}
}

function processS3Data(request) {
	var s3Schema = require('../s3Schema.json');
	s3Schema.input.host = request.query.host;
	s3Schema.input.ports = request.query.ports;
	return s3Schema
}
return Server;