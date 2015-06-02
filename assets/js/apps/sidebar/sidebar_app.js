var App = require('app');
var ShowController = require('apps/sidebar/show/controller');


App.module('SidebarApp', function(SidebarApp, App, Backbone, Marionette, $, _) {

	// SidebarApp needs to be manually started
	SidebarApp.startWithParent = false;


	// Sidebar API
	// ------------------
	var API = {
		showSidebar: function() {
			console.log('showSidebar');
			ShowController.showSidebar();
		},
		hideSidebar: function() {
			ShowController.hideSidebar();
		},
		activateElement: function(trigger) {
			ShowController.activateElement(trigger);
		},
		deactivateAllElements: function() {
			ShowController.deactivateAllElements();
		}
	};


	// Command handlers
	// ------------------
	App.commands.setHandler('sidebar:activate:element', function(trigger) {
		API.activateElement(trigger);
	});

	App.commands.setHandler('sidebar:deactivate:all', function() {
		API.deactivateAllElements();
	});


	// Event Listeners
	// ------------------
	App.on('sidebar:render', function() {
		API.showSidebar();
	});

	App.on('login', function(user, refresh) {
		SidebarApp.start();
	});

	App.on('logout', function() {
		SidebarApp.stop();
	});

	SidebarApp.on('start', function() {
		console.info('starting SidebarApp');
		API.showSidebar();
	});

	SidebarApp.on('stop', function() {
		console.info('stopping SidebarApp');
		API.hideSidebar();
	});
});

module.exports = App.SidebarApp;