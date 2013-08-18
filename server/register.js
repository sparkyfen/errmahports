var s3 = require('../s3.js');
var utils = require('../utils.js');
module.exports = function (request, response) {
	try {
		var firstName = utils.checkInput(utils.sanitizeInput(request.body.firstName, 'string'), 'string');
		var lastName = utils.checkInput(utils.sanitizeInput(request.body.lastName, 'string'), 'string');
		var email = utils.checkInput(utils.sanitizeInput(request.body.email, 'email'), 'email');
		if(firstName === undefined || lastName === undefined || email === undefined) {
			response.json(500, {message: 'Missing parameters.'});
		}
		var registerObj = {
			firstName: firstName,
			lastName: lastName,
			APIkey: utils.generateAPIKey(email)
		};
		s3.storeRegistration(registerObj, email, function (error, data) {
			if(error) {
				response.json(500, {message: error});
			}
			response.json(data);
		});
	} catch(e) {
		response.json(500, {message: e.message});
	}
};