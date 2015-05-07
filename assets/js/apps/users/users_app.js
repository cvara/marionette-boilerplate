// The controller is a NOT a top level requirement, since we must wait before
// the user navigates to a page managed by this app until we 'require' it
define(['app'], function(App) {

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
				require(['apps/users/login/controller'], function(Controller) {
					App.executeAction('UsersApp', Controller.showLogin);
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


		App.addInitializer(function() {
			new UsersAppRouter.Router({
				controller: API
			});
		});
	});

	return App.Routers.UsersApp;
});