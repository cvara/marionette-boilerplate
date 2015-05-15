define([
	'app',
	'apps/users/login/view',
	'common/authenticate',
	'cache/cache',
	'common/notify'
], function(App, View, Authenticate) {

	App.module('UsersApp.Login', function(Login, App, Backbone, Marionette, $, _) {

		Login.Controller = {
			showLogin: function() {

				var loginView = new View.Login();

				loginView.on('submit', function(data) {
					console.log(data);
					loginView.triggerMethod('clear:validation:errors');
					loginView.triggerMethod('show:preloader');
					// Log user in
					var authenticating = Authenticate.login(data);
					authenticating.done(function(response) {

					});
					authenticating.fail(function() {

					});
				});

				loginView.on('cancel', function() {
					App.showLanding();
				});

				App.rootView.showChildView('main', loginView);
			}
		};
	});

	return App.UsersApp.Login.Controller;
});