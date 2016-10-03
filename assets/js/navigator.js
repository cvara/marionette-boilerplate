var Backbone = require('backbone');
var Mn = require('backbone.marionette');
var Settings = require('settings');
var Radio = require('backbone.radio');
var GC = window.GC = Radio.channel('global');


module.exports = Mn.Object.extend({

	// Navigate History Stack
	// -------------------------------------------------------------
	// We manually store new history states on 'route' events to be
	// able to go back when needed. Useful for updating state (via
	// Nav.navigate) when closing a stateful overlay.
	// NOTE: it would be redundant to maintain our own history stack
	// if the only way to move out of a stateful overlay was the browser
	// back button (the browser maintains its own history stack). Overlays
	// close with custom events as well, and this is why this is needed.
	NavigateHistory: [],


	initialize: function(options) {
		// Detect browser back/fwd buttons and update Navigate History
		Backbone.history.on('route', function(route, params) {
			// Update our history stack
			this.pushHistoryState(this.getCurrentRoute(), route.options);
		}.bind(this));
	},


	// Helper Functions
	// -------------------------------------------------------------

	prependHistoryState: function(route, options) {
		this.NavigateHistory.unshift({
			route: route,
			options: options
		});
	},

	pushHistoryState: function(route, options) {
		console.trace('pushHistoryState');
		this.NavigateHistory.push({
			route: route,
			options: options
		});
	},

	// Navigates to route
	navigate: function(route, opts) {
		var options = opts || {};
		Backbone.history.navigate(route, options);

		// In case of replace, remove last history entry before adding the new one
		if (options.replace) {
			this.NavigateHistory.pop();
		}

		this.pushHistoryState(route, options);

		// Notify the rest of the app that a navigate happened
		// NOTE: 'route' events are fired by backbone only when
		// the trigger:true option is passed
		GC.trigger('navigate', route, opts);
	},

	// Navigates to previous route
	navigatePrevious: function(options) {
		// There is no previous route
		if (this.NavigateHistory.length < 2) {
			// Show landing & exit
			this.showLanding();
			return;
		}
		// Get previous state
		var previous = this.NavigateHistory[this.NavigateHistory.length - 2];
		// Extract route from previous state
		var route = typeof previous.route === 'string' ? previous.route : previous;
		// Extract options from previous state, allowing overrides by arg options
		var opts = _.extend({}, previous.options, options || {});
		// Navigate to previous route
		this.navigate(route, opts);
		console.log('Navigating to previous route: ', route);
	},


	// Returns current application state (route)
	getCurrentRoute: function() {
		return Backbone.history.fragment;
	},

	// Shows landing page based on user model
	showLanding: function(user) {
		var role = !!user ? user.get('role') : 'guest';
		var landing = Settings.landingTrigger[role];
		GC.trigger(landing);
	},

	// Goes to previous history state
	goBack: function() {
		this.navigatePrevious({
			trigger: true
		});
	},

	// Opens URL in new tab
	openInNewTab: function(url) {
		var win = window.open(url, '_blank');
		win.focus();
	},

	// Go to url (redirect)
	goToUrl: function(url) {
		// similar behavior as clicking on a link
		window.location.href = url;
	},

	// Opens URL in popup window
	openPopup: function(url) {
		var popupFeatures = 'left=10,top=10,resizable=yes,scrollbars=no,status=0,toolbar=0,width=920,height=436';
		return window.open(url, 'Popup', popupFeatures);
	}
});
