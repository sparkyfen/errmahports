var s3 = require('../s3.js');

var request = {
	host: "192.168.0.1",
	ports: [80,443],
	uuid: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
};

s3.storeRequest(request, function (error, data) {
	if(error) {
		console.log(error);
	}
	console.log(data);
});