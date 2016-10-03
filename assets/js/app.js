var Mn = require('backbone.marionette');
var Backbone = require('backbone');
var Navigator = require('navigator');
var HeaderRegion = require('apps/config/marionette/regions/header');
var MainRegion = require('apps/config/marionette/regions/main');
var DialogRegion = require('apps/config/marionette/regions/dialog');
var LoadingRegion = require('apps/config/marionette/regions/loading');
var OverlayRegion = require('apps/config/marionette/regions/overlay');
var ValidatorConfig = require('apps/config/validator/validator');
var Settings = require('settings');
var Radio = require('backbone.radio');
var GC = window.GC = Radio.channel('global');


// Initialize Marionette Application
// -------------------------------------------------------------
// The application is also registered as a global variable,
// so that it can be referenced from inside Underscore templates
var App = window.App = new Mn.Application();



// Our custom region classes
// -------------------------------------------------------------
var headerRegion = HeaderRegion.extend({
	el: '#header-section'
});
var mainRegion = MainRegion.extend({
	el: '#main-region'
});
var dialogRegion = DialogRegion.extend({
	el: '#dialog-region'
});
var loadingRegion = LoadingRegion.extend({
	el: '#loading-region'
});
var overlayRegion = OverlayRegion.extend({
	el: '#overlay-region'
});


// The root LayoutView of our app within the context of 'body'
// -------------------------------------------------------------
// Our custom region classes are attached to this LayoutView
// instead of our app object.
var RootView = Mn.View.extend({
	el: 'body',

	regions: {
		header  : headerRegion,
		main    : mainRegion,
		dialog  : dialogRegion,
		loading : loadingRegion,
		overlay : overlayRegion
	}
});


// Attach the rootView to the App object for easier access
// -------------------------------------------------------------
App.rootView = new RootView();


// Login Indicator
// -------------------------------------------------------------
App.isLoggedIn = false;


App.Navigator = App.Nav = new Navigator();


// URL Requested By Guest
// -------------------------------------------------------------
// This is the url requested by current guest user, before
// being redirected due to access rights
App.requestedGuestUrl = false;

// Inits app for member
App.initForMember = function(user) {
	// Notify all modules that user logged in
	GC.trigger('login', user, false);
	// Initialize history and cause the triggering of a route
	Backbone.history.start({pushState: Settings.HTML5History});
	// Redirect empty route to landing page
	if (App.Nav.getCurrentRoute() === '') {
		App.Nav.showLanding(user);
	} else {
		App.Nav.pushHistoryState(App.Nav.getCurrentRoute());
	}
};

// Inits app for guest
App.initForGuest = function() {
	Backbone.history.start({silent: true, pushState: Settings.HTML5History});
	// Are they accessing a protected URL?
	if (!Settings.unprotectedURL.test(App.Nav.getCurrentRoute())) {
		// store their intended destination
		App.requestedGuestUrl = App.Nav.getCurrentRoute();
		// redirect them to guest landing
		App.Nav.showLanding();
	} else {
		Backbone.history.stop();
		Backbone.history.start({silent: false});
		if (App.Nav.getCurrentRoute() === '') {
			App.Nav.showLanding();
		} else {
			App.Nav.pushHistoryState(App.Nav.getCurrentRoute());
		}
	}
};

GC.on('refresh:mainRegion', function() {
	// need to null out Backbone.history.fragement because
	// navigate method will ignore when it is the same as newFragment
	var currentRoute = App.Nav.getCurrentRoute();
	Backbone.history.fragment = null;
	App.Nav.navigate(currentRoute, {
		trigger: true
	});
	console.log('App:refresh:mainRegion');
});

// Get notified when user logs in
GC.on('login', function(user, refresh) {
	console.info('User logged in. Role: ', user.get('role'));
	// mark user as logged in
	App.isLoggedIn = true;
	if (!!refresh) {
		GC.trigger('refresh:mainRegion');
	}
});

// Get notified when user logs out
GC.on('logout', function() {
	App.isLoggedIn = false;
	GC.trigger('splash:show');
});

// Get notified when user logs out
GC.on('close:overlapping:interfaces', function(maintainState) {
	App.rootView.getRegion('dialog').closeModal();
	App.rootView.getRegion('overlay').closeOverlay(maintainState);  // close without changing state
});

// Listen to 'history:back' events fired from overlay region
App.listenTo(App.rootView.getRegion('overlay'), 'history:back', function() {
	App.Nav.navigatePrevious();
});


module.exports = App;
