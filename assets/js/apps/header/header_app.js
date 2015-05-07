// The controller is a top level requirement because it will always be
// needed by the time our app (and consequently this module) starts, since
// the header is always shown
define(['app', 'apps/header/show/controller'], function(App, ShowController) {

	App.module('HeaderApp', function(HeaderApp, App, Backbone, Marionette, $, _) {

		// HeaderApp needs to be manually started
		HeaderApp.startWithParent = false;


		// Header API
		// ------------------
		var API = {
			showHeader: function() {
				ShowController.showHeader();
			}
		};


		// Event Listeners
		// ------------------
		App.on('header:render', function() {
			API.showHeader();
		});

		App.on('login', function(user, refresh) {
			API.showHeader();
		});

		App.on('logout', function() {
			API.showHeader();
		});

		HeaderApp.on('start', function() {
			console.info('starting HeaderApp');
			API.showHeader();
		});
	});

	return App.HeaderApp;
});