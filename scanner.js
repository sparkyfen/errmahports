var s3 = require('./s3.js');
var Scanner = function(){}

/**
 * Scans the incoming host and returns the result
 * @param  {Object} sqsObj  The SQS message from Amazon SQS.
 * @param  {Function} callback	The callback function to return back up the "stack" 
 * @return {Function} callback  ^
 */
exports.scanHost = function (sqsObj, callback) {
	// TODO re-write this so it acually scans and returns the object
	var testPortsResult = {ports: {}};
	for(var portCounter = 0; portCounter < sqsObj.input.ports.length; portCounter++) {
		testPortsResult['ports'][sqsObj.input.ports[portCounter]] = true;
	}
	return callback(null, testPortsResult);
	//return object: {ports: {80: true, 443: true}};
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