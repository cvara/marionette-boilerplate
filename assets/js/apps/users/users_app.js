var App = require('app');
var Marionette = require('backbone.marionette');
var Radio = require('backbone.radio');
var GlobalChannel = Radio.channel('global');


// Router
// ------------------
var Router = Marionette.AppRouter.extend({
	appRoutes: {
		'users/login': 'showLogin'
	}
});

// API
// ------------------
var API = {
	showLogin: function(user) {
		require.ensure(['apps/users/login/controller'], function(require) {
			var LoginController = require('apps/users/login/controller');
			App.executeAction('UsersApp', LoginController.showLogin);
		});
	}
};

// Event Listeners
// ------------------
GlobalChannel.on('users:login:show', function() {
	App.navigate('users/login');
	API.showLogin();
});

// Install Router
// ------------------
new Router({
	controller: API
});


module.exports = API;
