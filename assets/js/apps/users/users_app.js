var App = require('app');


App.module('UsersApp', function(UsersApp, App, Backbone, Marionette, $, _) {
	UsersApp.startWithParent = false;

	UsersApp.onStart = function() {
		console.info('starting UsersApp');
	};

	UsersApp.onStop = function() {
		console.info('stopping UsersApp');
	};
});

App.module('Routers.UsersApp', function(UsersAppRouter, App, Backbone, Marionette, $, _) {

	// Users Router
	// ------------------
	UsersAppRouter.Router = Marionette.AppRouter.extend({
		appRoutes: {
			'users/login': 'showLogin'
		}
	});

	// Users API
	// ------------------
	var API = {
		showLogin: function(user) {
			require.ensure(['apps/users/login/controller'], function(require) {
				var LoginController = require('apps/users/login/controller');
				App.executeAction('UsersApp', LoginController.showLogin);
				App.execute('sidebar:deactivate:all');
			});
		}
	};

	// Event Listeners
	// ------------------
	App.on('users:login:show', function() {
		App.navigate('users/login');
		API.showLogin();
	});

	// Install Router
	// ------------------
	new UsersAppRouter.Router({
		controller: API
	});
});

module.exports = App.Routers.UsersApp;