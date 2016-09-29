var Marionette = require('backbone.marionette');
var Backbone = require('backbone');
var HeaderRegion = require('apps/config/marionette/regions/header');
var MainRegion = require('apps/config/marionette/regions/main');
var DialogRegion = require('apps/config/marionette/regions/dialog');
var LoadingRegion = require('apps/config/marionette/regions/loading');
var OverlayRegion = require('apps/config/marionette/regions/overlay');
var ValidatorConfig = require('apps/config/validator/validator');
var Settings = require('settings');
var Radio = require('backbone.radio');
var GlobalChannel = window.GC = Radio.channel('global');


// Initialize Marionette Application
// -------------------------------------------------------------
// The application is also registered as a global variable,
// so that it can be referenced from inside Underscore templates
var App = window.App = new Marionette.Application();



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
var RootView = Marionette.View.extend({
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


// URL Requested By Guest
// -------------------------------------------------------------
// This is the url requested by current guest user, before
// being redirected due to access rights
App.requestedGuestUrl = false;


// Navigate History Stack
// -------------------------------------------------------------
// We manually store new history states on 'route' events to be
// able to go back when needed. Useful for updating state (via
// App.navigate) when closing a stateful overlay.
// NOTE: it would be redundant to maintain our own history stack
// if the only way to move out of a stateful overlay was the browser
// back button (the browser maintains its own history stack). Overlays
// close with custom events as well, and this is why this is needed.
App.NavigateHistory = [];



// Helper Functions
// -------------------------------------------------------------

App.prependHistoryState = function(route) {
	App.NavigateHistory.unshift({
		route: route,
		options: null
	});
};

// Navigates to route
App.navigate = function(route, opts) {
	var options = opts || {};
	Backbone.history.navigate(route, options);

	// In case of replace, remove last history entry before adding the new one
	if (options.replace) {
		App.NavigateHistory.pop();
	}

	App.NavigateHistory.push({
		route: route,
		options:  options
	});

	// Notify the rest of the app that a navigate happened
	// NOTE: 'route' events are fired by backbone only when
	// the trigger:true option is passed
	GlobalChannel.trigger('navigate', route, opts);
};

// Navigates to previous route
App.navigatePrevious = function(options) {
	// There is no previous route
	if (App.NavigateHistory.length < 2) {
		// Show landing & exit
		App.showLanding();
		return;
	}
	// Get previous state
	var previous = App.NavigateHistory[App.NavigateHistory.length - 2];
	// Extract route from previous state
	var route = typeof previous.route === 'string' ? previous.route : previous;
	// Extract options from previous state, allowing overrides by arg options
	var opts = _.extend({}, previous.options, options || {});
	// Navigate to previous route
	App.navigate(route, opts);
	console.log('Navigating to previous route: ', route);
};


// Returns current application state (route)
App.getCurrentRoute = function() {
	return Backbone.history.fragment;
};

// Centralized controller method (action) call
// All sub-apps use this method for calling controller methods
App.executeAction = function(appName, action, args) {
	var args = typeof args !== 'undefined' ? args : {};
	return action(args);
};

// Shows landing page based on user model
App.showLanding = function(user) {
	var role = !!user ? user.get('role') : 'guest';
	var landing = Settings.landingTrigger[role];
	GlobalChannel.trigger(landing);
};

// Goes to previous history state
App.goBack = function() {
	App.navigatePrevious({
		trigger: true
	});
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
	GlobalChannel.trigger('login', user, false);
	// Initialize history and cause the triggering of a route
	Backbone.history.start({pushState: Settings.HTML5History});
	// Redirect empty route to landing page
	if (App.getCurrentRoute() === '') {
		App.showLanding(user);
	} else {
		App.NavigateHistory.push(App.getCurrentRoute());
	}

};

// Inits app for guest
App.initForGuest = function() {
	Backbone.history.start({silent: true, pushState: Settings.HTML5History});
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
		} else {
			App.NavigateHistory.push(App.getCurrentRoute());
		}
	}
};

GlobalChannel.on('refresh:mainRegion', function() {
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
GlobalChannel.on('login', function(user, refresh) {
	console.info('User logged in. Role: ', user.get('role'));
	// mark user as logged in
	App.isLoggedIn = true;
	if (!!refresh) {
		GlobalChannel.trigger('refresh:mainRegion');
	}
});

// Get notified when user logs out
GlobalChannel.on('logout', function() {
	App.isLoggedIn = false;
	GlobalChannel.trigger('splash:show');
});

// Get notified when user logs out
GlobalChannel.on('close:overlapping:interfaces', function(maintainState) {
	App.rootView.getRegion('dialog').closeModal();
	App.rootView.getRegion('overlay').closeOverlay(maintainState);  // close without changing state
});

// Listen to 'history:back' events fired from overlay region
App.listenTo(App.rootView.getRegion('overlay'), 'history:back', function() {
	App.navigatePrevious();
});


module.exports = App;
