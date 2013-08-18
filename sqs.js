var AWS = require('aws-sdk');
var settings = require('./settings.js');
//Setup AWS credentials for S3
var sqsAccessKey = settings.sqs.accessKey;
var sqsSecretAccessKey = settings.sqs.secretAccessKey;
var sqsQueueName = settings.sqs.queueName;
var sqsRegion = settings.sqs.region;
var sqsEndpoint = settings.sqs.endPoint;
if(sqsAccessKey === '' || sqsSecretAccessKey === '' || sqsQueueName === '' || sqsRegion === '' || sqsEndpoint === '') {
	throw new ReferenceError('There was a problem locating the AWS SQS settings, check your settings file.');
}
var sqs = new AWS.SQS({
	endpoint: sqsEndpoint,
	accessKeyId: sqsAccessKey,
	secretAccessKey: sqsSecretAccessKey,
	region: sqsRegion
});
if(sqs === undefined) {
	throw new ReferenceError('Unable to find the SQS Module, please make sure aws-sdk is installed.');
}

var SQS = function() {}

exports.storeMessage = function (sqsObj, callback) {
	this.getQueueUrl(function (error, url) {
		if(error) {
			return callback(error);
		}
		sqs.sendMessage({QueueUrl: url, MessageBody: JSON.stringify(sqsObj)}, function (error, data) {
			if(error) {
				return callback(error);
			}
			return callback();
		});
	});
};

exports.getMessage = function (callback) {
	this.getQueueUrl(function (error, url) {
		if(error) {
			return callback(error);
		}
		sqs.receiveMessage({QueueUrl: url}, function (error, data) {
			if(error) {
				return callback(error);
			}
			return callback(null, data);
		});
	});
};

exports.deleteMessage = function (receiptID, callback) {
	if(receiptID === undefined) {
		return callback('Missing receiptID');
	}
	this.getQueueUrl(function (error, url) {
		if(error) {
			return callback(error);
		}
		sqs.deleteMessage({QueueUrl: url, ReceiptHandle: receiptID}, function (error, data) {
			if(error) {
				return callback(error);
			}
			return callback();
		});
	});
};

exports.getQueueUrl = function(callback) {
	sqs.getQueueUrl({QueueName: sqsQueueName}, function (error, data) {
		if(error) {
			return callback(error);
		}
		return callback(null, data.QueueUrl);
	});
};