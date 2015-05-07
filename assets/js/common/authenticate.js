define(['app'], function(App) {

	var Authenticate = {};

	// Login URL
	Authenticate.loginURL = App.request('setting', 'RootURL') + '/login';

	// Logout URL
	Authenticate.logoutURL = App.request('setting', 'RootURL') + '/logout';

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


	return Authenticate;
});