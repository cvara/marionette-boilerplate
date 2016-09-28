var App = require('app');
var Settings = require('settings');


var Authenticate = {};

// Login URL
Authenticate.loginURL = Settings.RootURL + '/login';

// Logout URL
Authenticate.logoutURL = Settings.RootURL + '/logout';

//
// Request user login
// --------------------------------------------------
//
Authenticate.login = function(user) {
	if (user instanceof Backbone.Model) {
		user = user.attributes;
	}
	return $.post(Authenticate.loginURL, {
		email: user.user.email,
		password: user.password
	});
};

//
// Request user logout
// --------------------------------------------------
//
Authenticate.logout = function() {
	return $.post(Authenticate.logoutURL);
};


module.exports = Authenticate;
