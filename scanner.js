var s3 = require('./s3.js');
var exec = require('child_process').exec;
var Scanner = function(){}

/**
 * Scans the incoming host and returns the result
 * @param  {Object} sqsObj  The SQS message from Amazon SQS.
 * @param  {Function} callback	The callback function to return back up the "stack" 
 * @return {Function} callback  ^
 */
exports.scanHost = function (sqsObj, callback) {
	var pythonCommand = '../portz.py ' + sqsObj.input.host + ' ' + sqsObj.input.ports.join(',');
	var child = exec(pythonCommand, function (error, stdout, stderr) {
		if(error) {
			return callback(error);
		}
		if(stderr) {
			return callback(stderr);
		}
		return callback(null, stdout.toString());
	});
};

/**
 * Gets the status of a request from S3
 * @param  {Object}   request  The http(s) request from the user.
 * @param  {Function} callback The callback function to return back up the "stack" 
 * @return {Function} callback  ^
 */
exports.status = function (request, callback) {
	var uuid = request.query.uuid;
	s3.status(uuid, function (error, data) {
		if(error) {
			return callback(error);
		}
		return callback(null, data);
	});
};
return Scanner;