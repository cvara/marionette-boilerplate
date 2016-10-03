var App = require('app');
var Mn = require('backbone.marionette');
var Radio = require('backbone.radio');
var GC = Radio.channel('global');


// Router
// ------------------
var Router = Mn.AppRouter.extend({
	appRoutes: {
		'users/login': 'showLogin'
	}
});

// API
// ------------------
var API = {
	showLogin: function(user) {
		require.ensure(['./login/controller'], function(require) {
			var LoginController = require('./login/controller');
			LoginController.showLogin();
		});
	}
};

// Event Listeners
// ------------------
GC.on('users:login:show', function() {
	App.Nav.navigate('users/login');
	API.showLogin();
});

// Install Router
// ------------------
new Router({
	controller: API
});


module.exports = API;
