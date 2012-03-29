var b64 = require('b64');
var request = require('request');

function EloquaRequest(baseUrl, site, user, password) {
	this.baseUrl = baseUrl;
	this.credential = b64.encode(site + "\\" + user + ":" + password);
}

EloquaRequest.prototype.httpRequest = function(url, options, callback) {
	var _this = this;
	var requestOptions = { url: _this.baseUrl + url, headers: { Authorization: "Basic " + _this.credential }, json: true };
  for (var key in options) {
    var val = options[key];
    requestOptions[key] = val;
  }
	console.log((requestOptions.method || "GET") + ": " + requestOptions.url);
  
  return request(requestOptions, function(err, response, body) {
		if (err !== null) return callback(err, null);
		if (response.statusCode !== 200 && response.statusCode !== 201) return callback({ code: response.statusCode, msg: body }, null);
		console.log('request success');
    return callback(null, body);
  });
};

EloquaRequest.prototype.get = function(uri, callback) {
	this.httpRequest(uri, null, callback);
};

EloquaRequest.prototype.put = function(uri, data, callback) {
	var options = { method: "PUT", data: data };
	this.httpRequest(uri, options, callback);
};

EloquaRequest.prototype.post = function(uri, data, callback) {
	var options = { method : "POST", data: data };	
	this.httpRequest(uri, options, callback);
};

EloquaRequest.prototype.remove = function(uri, callback) {
	var options = { method: "DELETE" };
	this.httpRequest(uri, options, callback);
};

module.exports = EloquaRequest;