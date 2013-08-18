var check = require('validator').check;
var sanitize = require('validator').sanitize;
var settings = require('./settings.js');
var crypto = require('crypto');

var Utils = function(){}


exports.sanitizeInput = function(input, type) {
	if(input === null || type === '') {
		throw new ReferenceError('Missing input value.');
	}
	if(type === null || type === '') {
		throw new ReferenceError('Missing type.');
	}
	switch(type) {
		case 'int':
			return sanitize(input).toInt();
		break;
		case 'string':
		case 'email':
			var output = sanitize(input).trim();
			output = sanitize(output).xss();
			return output;
		break;
		case 'boolean':
			return sanitize(input).toBoolean();
		break;
		default:
			return null;
		break;
	}
};

exports.checkInput = function(input, type) {
	if(input === null || input === '') {
		throw new ReferenceError('Missing input value.');
	}
	if(type === null || type === '') {
		throw new ReferenceError('Missing type.');
	}
	switch(type) {
		case 'int':
			check(input, 'Please enter a valid number.').isInt();
			return input;
		break;
		case 'string':
			check(input, 'Please enter a valid string.').notNull();
			check(input, 'Please enter a valid string.').notEmpty();
			return input;
		break;
		case 'email':
			check(input, 'Please eneter a valid email.').isEmail();
			return input;
		case 'url':
			check(input, 'Please enter a valid URL.').isUrl();
			return input;
		break;
		case 'IPv4':
			check(input, 'Please enter a valid IPv4 Address.').isIPv4();
			return input;
		break;
		case 'IPv6':
			check(input, 'Please enter a valid IPv6 Address.').isIPv6();
			return input;
		case 'UUID':
			check(input, 'Please enter a valid UUID.').isUUIDv4();
			return input;
		default:
			return null;
		break;
	}
};

exports.generateAPIKey = function(email) {
	return crypto.createHmac('sha1', settings.server.cryptoKey).update(email).digest('hex');
};

return Utils;