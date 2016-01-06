var http = require('http');
var https = require('https');
var cheerio = require('cheerio');
var Q = require('q');
var querystring = require('querystring');
var urlModule = require('url');

var rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;

var shorthandProperties = {
	"image": "image:url",
	"video": "video:url",
	"audio": "audio:url"
}

exports.isValidUrl = function(url) {
	return url.match(rValidUrl);
}

exports.getMetaData = function() {
	var deferred = Q.defer();

	exports.get(url)
		.then(function(res) {
			if(res.status cod)
		})
}