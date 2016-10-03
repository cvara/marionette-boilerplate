var App = require('app');
var View = require('./view');
var Authenticate = require('common/authenticate');
var Notify = require('common/notify');


var Controller = {};

Controller.showLogin = function() {

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
		App.Nav.showLanding();
	});

	App.rootView.showChildView('main', loginView);
};

module.exports = Controller;
