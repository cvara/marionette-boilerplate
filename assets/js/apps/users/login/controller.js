var App = require('app');
var View = require('apps/users/login/view');
var Authenticate = require('common/authenticate');
var Cache = require('cache/cache');
var Notify = require('common/notify');


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

module.exports = App.UsersApp.Login.Controller;