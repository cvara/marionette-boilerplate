/* global Marionette:true */
var Marionette = require('marionette');
var Behaviors = require('common/behaviors');
var spinnerOpts = require('apps/config/spinner/options');
require('apps/config/marionette/regions/header');
require('apps/config/marionette/regions/sidebar');
require('apps/config/marionette/regions/main');
require('apps/config/marionette/regions/dialog');
require('apps/config/marionette/regions/loading');
require('apps/config/marionette/regions/overlay');
require('apps/config/validator/validator');



// Initialize Marionette Application
// -------------------------------------------------------------
// The application is also registered as a global variable,
// so that it can be referenced from inside Underscore templates
var App = window.App = new Marionette.Application();


// Global Application Settings
// -------------------------------------------------------------
// Accessible via App.request('setting', <setting_name>);
var Settings = {};
// Enable CORS client-side
Settings.EnableCORS = true;
// Landing page triggers for each user role
Settings.landingTrigger = {
	'admin' : 'some:trigger',
	'user'  : 'some:other:trigger',
	'guest' : 'splash:show'
};
// Routes accessible by guests
Settings.unprotectedURL = /splash|login|register|^static/;
// Global file size limit
Settings.FileSizeLimit = 2 * 1024 * 1024; // 2mb

// Location of the API
Settings.RootURL = '';
// #ifndef PRODUCTION
// Settings.RootURL = 'https://App.herokuapp.com'; // heroku
// #endif


// Our custom region classes
// -------------------------------------------------------------
var headerRegion = Marionette.Region.Header.extend({
	el: '#header-section'
});
var sidebarRegion = Marionette.Region.Sidebar.extend({
	el: '#sidebar-section'
});
var mainRegion = Marionette.Region.Main.extend({
	el: '#main-region'
});
var dialogRegion = Marionette.Region.Dialog.extend({
	el: '#dialog-region'
});
var loadingRegion = Marionette.Region.Loading.extend({
	el: '#loading-region'
});
var overlayRegion = Marionette.Region.Overlay.extend({
	el: '#overlay-region'
});


// The root LayoutView of our app within the context of 'body'
// -------------------------------------------------------------
// Our custom region classes are attached to this LayoutView
// instead of our app object.
var RootView = Marionette.LayoutView.extend({
	el: 'body',

	regions: {
		header  : headerRegion,
		sidebar : sidebarRegion,
		main    : mainRegion,
		dialog  : dialogRegion,
		loading : loadingRegion,
		overlay : overlayRegion
	}
});


// Attach the rootView to the App object for easier access
// -------------------------------------------------------------
App.rootView = new RootView();


// Behaviors
// -------------------------------------------------------------
// Point to our Behaviors object
Marionette.Behaviors.behaviorsLookup = function() {
	return Behaviors;
};


// Login Indicator
// -------------------------------------------------------------
App.isLoggedIn = false;


// URL Requested By Guest
// -------------------------------------------------------------
// This is the url requested by current guest user, before
// being redirected due to access rights
App.requestedGuestUrl = false;


// Helper Functions
// -------------------------------------------------------------

// Navigates to route
App.navigate = function(route, opts) {
	var options = opts || {};
	Backbone.history.navigate(route, options);
};

// Returns current application state (route)
App.getCurrentRoute = function() {
	return Backbone.history.fragment;
};

// Centralized controller method (action) call
// All sub-apps use this method for calling controller methods
App.executeAction = function(appName, action, args) {
	var args = typeof args !== 'undefined' ? args : {};
	if (!args.asModal) {
		App.execute('deselect:all:sidebar');
	}
	App.startSubApp(appName, args.asModal);
	return action(args);
};

// Starts a sub-application
App.startSubApp = function(appName, asModal, args) {
	// get module based on appName
	var currentApp = appName ? App.module(appName) : null;
	// app will be used by a dialog
	if (asModal) {
		App.dialogApp = currentApp;
		currentApp.start(args);
		return;
	}
	// for non-dialog apps, close dialog (if open)
	App.rootView.getRegion('dialog').closeModal();
	// do nothing more if needed app is already started
	if (App.currentApp === currentApp) {
		return;
	}
	// stop previous app
	if (App.currentApp) {
		App.currentApp.stop();
	}
	// start new app
	App.currentApp = currentApp;
	if (currentApp) {
		currentApp.start(args);
	}
};

// Shows landing page based on user model
App.showLanding = function(user) {
	var role = !!user ? user.get('role') : 'guest';
	var landing = App.request('setting', 'landingTrigger')[role];
	App.trigger(landing);
};

// Goes to previous history state
App.goBack = function() {
	window.history.back();
};

// Encodes value (double utf-8)
App.encode = function(value) {
	return encodeURIComponent(encodeURIComponent(value));
};

// Decodes value (double utf-8)
App.decode = function(value) {
	return decodeURIComponent(decodeURIComponent(value));
};

// Opens URL in new tab
App.openInNewTab = function(url) {
	var win = window.open(url, '_blank');
	win.focus();
};

// Go to url (redirect)
App.goToUrl = function(url) {
	// similar behavior as clicking on a link
	window.location.href = url;
};

// Opens URL in popup window
App.openPopup = function(url) {
	var popupFeatures = 'left=10,top=10,resizable=yes,scrollbars=no,status=0,toolbar=0,width=920,height=436';
	return window.open(url, 'App Popup', popupFeatures);
};

// Inits app for member
App.initForMember = function(user) {
	// Notify all modules that user logged in
	App.trigger('login', user, false);
	// Initialize history and cause the triggering of a route
	Backbone.history.start();
	// Redirect empty route to landing page
	if (App.getCurrentRoute() === '') {
		App.showLanding(user);
	}
};

// Inits app for guest
App.initForGuest = function() {
	console.log('initForGuest');
	Backbone.history.start({silent: true});
	// Are they accessing a protected URL?
	if (!Settings.unprotectedURL.test(App.getCurrentRoute())) {
		// store their intended destination
		App.requestedGuestUrl = App.getCurrentRoute();
		// redirect them to guest landing
		App.showLanding();
	} else {
		Backbone.history.stop();
		Backbone.history.start({silent: false});
		if (App.getCurrentRoute() === '') {
			App.showLanding();
		}
	}
};

App.commands.setHandler('refresh:mainRegion', function() {
	// need to null out Backbone.history.fragement because
	// navigate method will ignore when it is the same as newFragment
	var currentRoute = App.getCurrentRoute();
	Backbone.history.fragment = null;
	App.navigate(currentRoute, {
		trigger: true
	});
	console.log('App:refresh:mainRegion');
});

// Get notified when user logs in
App.on('login', function(user, refresh) {
	console.info('User logged in. Role: ', user.get('role'));
	// mark user as logged in
	App.isLoggedIn = true;
	if (!!refresh) {
		App.execute('refresh:mainRegion');
	}
});

// Get notified when user logs out
App.on('logout', function() {
	App.isLoggedIn = false;
	App.trigger('splash:show');
	// App.execute('refresh:mainRegion');
});

App.reqres.setHandler('setting', function(which) {
	return Settings[which];
});

module.exports = App;