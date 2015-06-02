var App = require('app');
var ShowController = require('apps/header/show/controller');


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

module.exports = App.HeaderApp;