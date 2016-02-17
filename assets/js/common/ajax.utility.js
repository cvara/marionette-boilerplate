var jquery = require('jquery');
var jqueryCookie = require('jquery.cookie');


var Utility = {};

Utility.csrfSafeMethod = function(method) {
	// these HTTP methods do not require CSRF protection
	return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
};


Utility.sameOrigin = function(url) {
	// test that a given url is a same-origin URL
	// url could be relative or scheme relative or absolute
	var host = document.location.host; // host + port
	var protocol = document.location.protocol;
	var sr_origin = '//' + host;
	var origin = protocol + sr_origin;
	// console.log('url: ', url);
	// console.log('origin: ', origin);
	// Allow absolute or scheme relative URLs to same origin
	return (url === origin || url.slice(0, origin.length + 1) === origin + '/') ||
		(url === sr_origin || url.slice(0, sr_origin.length + 1) === sr_origin + '/') ||
		// or any other URL that isn't scheme relative or absolute i.e relative.
		!(/^(\/\/|http:|https:).*/.test(url));
};


Utility.enableCORS = function() {
	// enable CORS requests & attach cookies to them
	jquery.ajaxSetup({
		xhrFields: {
			withCredentials: false
		},
		crossDomain: true
	});
};


Utility.setupCSRFToken = function() {
	var csrftoken = jquery.cookie('csrftoken');
	console.log('csrftoken: ', csrftoken);
	// enable CORS requests & attach cookies to them
	jquery.ajaxSetup({
		beforeSend: function(xhr, settings) {
			if (!Utility.csrfSafeMethod(settings.type) &&
				Utility.sameOrigin(settings.url)) {
				// Send the token to same-origin, relative URLs only.
				// Send the token only if the method warrants CSRF protection
				// Using the CSRFToken value acquired earlier
				console.log('setRequestHeader csrftoken: ', csrftoken);
				xhr.setRequestHeader('X-CSRFToken', csrftoken);
			}
		}
	});
};

module.exports = Utility;