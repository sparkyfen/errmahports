var s3 = require('./s3.js');
var Scanner = function(){}

/**
 * Scans the incoming host and returns the result
 * @param  {Object} request  The http(s) request from the user.
 * @param  {Function} callback	The callback function to return back up the "stack" 
 * @return {Function} callback  ^
 */
exports.scanHost = function (request, callback) {
	//Error:
	//return callback({message: 'Fail', UID: 'N/A'});
	//Success:
	//return callback(null, {message: 'Success', UID: '1203090-1209382109-0980983'});
};

/**
 * Gets the status of a request from S3
 * @param  {Object}   request  The http(s) request from the user.
 * @param  {Function} callback The callback function to return back up the "stack" 
 * @return {Function} callback  ^
 */
exports.status = function (request, callback) {
	var uid = request.query.uid;
	s3.status(uid, function (error, data) {
		if(error) {
			return callback(error);
		}
		return callback(null, data);
	});
};
return Scanner;