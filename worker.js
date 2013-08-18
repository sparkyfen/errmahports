// TODO Add worker that constantly checks queue for messages and stores in s3 as well as sending them off to scan
var Scanner = require('./scanner.js');
var sqs = require('./sqs.js');
var s3 = require('./s3.js');
var worker = function() {}

exports.initialize = function () {
	setInterval(function () {
		sqs.getMessage(function (error, data) {
			if(error) {
				console.log(error);// TODO convert this to a log
				return;
			}
			var body = JSON.parse(data.Messages[0].Body);
			var receiptID = data.Messages[0].ReceiptHandle;
			Scanner.scanHost(body, function (error, hostResults) {
				if(error) {
					console.log(error);// TODO convert this to a log
					return;		
				}
				var s3Schema = require('./s3Schema.json');
				s3Schema.input = body.input;
				s3Schema.output.ports = hostResults.ports;
				s3Schema.output.host = body.input.host;
				s3.storeRequest(s3Schema, body.uuid, function (error) {
					if(error) {
						console.log(error);
						return;
					}
					sqs.deleteMessage(receiptID, function (error) {
						if(error) {
							console.log(error);
							return;
						}
					});
				});
			});
		});
	}, 3000);
};

return worker;