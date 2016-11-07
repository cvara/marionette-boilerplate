
// Tests if a method requires csrf protection
export const csrfSafeMethod = (method) => {
	return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
};

// Test that a given url is a same-origin URL
export const sameOrigin = (url) => {

	// url could be relative or scheme relative or absolute
	const host = document.location.host; // host + port
	const protocol = document.location.protocol;
	const sr_origin = '//' + host;
	const origin = protocol + sr_origin;
	// console.log('url: ', url);
	// console.log('origin: ', origin);
	// Allow absolute or scheme relative URLs to same origin
	return (url === origin || url.slice(0, origin.length + 1) === origin + '/') ||
		(url === sr_origin || url.slice(0, sr_origin.length + 1) === sr_origin + '/') ||
		// or any other URL that isn't scheme relative or absolute i.e relative.
		!(/^(\/\/|http:|https:).*/.test(url));
};

export const enableCORS = (jquery) => {
	// enable CORS requests & attach cookies to them
	jquery.ajaxSetup({
		xhrFields: {
			withCredentials: false
		},
		crossDomain: true
	});
};


export const setupCSRFToken = (jquery) => {
	const csrftoken = jquery.cookie('csrftoken');
	// enable CORS requests & attach cookies to them
	jquery.ajaxSetup({
		beforeSend(xhr, settings) {
			if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
				// Send the token to same-origin, relative URLs only.
				// Send the token only if the method warrants CSRF protection
				// Using the CSRFToken value acquired earlier
				console.log('setRequestHeader csrftoken: ', csrftoken);
				xhr.setRequestHeader('X-CSRFToken', csrftoken);
			}
		}
	});
};
