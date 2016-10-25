import Backbone from 'backbone';
import Mn from 'backbone.marionette';
import Settings from 'settings';
import Radio from 'backbone.radio';
const GC = window.GC = Radio.channel('global');


export default Mn.Object.extend({

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
		Backbone.history.on('route', (route, params) => {
			// Update our history stack
			this.pushHistoryState(this.getCurrentRoute(), route.options);
		});
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
		this.NavigateHistory.push({
			route: route,
			options: options
		});
	},

	// Navigates to route
	navigate: function(route, opts) {
		const options = opts || {};

		// Notify the rest of the app that navigate is about to happen
		// NOTE: 'route' events are fired by backbone only when {trigger:true} option is passed
		// and when browser address bar and back/fwd buttons are used
		GC.trigger('before:navigate', route, opts);

		Backbone.history.navigate(route, options);

		// In case of replace, remove last history entry before adding the new one
		if (options.replace) {
			this.NavigateHistory.pop();
		}

		this.pushHistoryState(route, options);

		// Notify the rest of the app that a navigate has happened
		// NOTE: 'route' events are fired by backbone only when {trigger:true} option is passed
		// and when browser address bar and back/fwd buttons are used
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
		const previous = this.NavigateHistory[this.NavigateHistory.length - 2];
		// Extract route from previous state
		const route = typeof previous.route === 'string' ? previous.route : previous;
		// Extract options from previous state, allowing overrides by arg options
		const opts = _.extend({}, previous.options, options || {});
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
		const role = user ? user.get('role') : 'guest';
		const landing = Settings.landingTrigger[role];
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
		const win = window.open(url, '_blank');
		win.focus();
	},

	// Go to url (redirect)
	goToUrl: function(url) {
		// similar behavior as clicking on a link
		window.location.href = url;
	},

	// Opens URL in popup window
	openPopup: function(url) {
		const popupFeatures = 'left=10,top=10,resizable=yes,scrollbars=no,status=0,toolbar=0,width=920,height=436';
		return window.open(url, 'Popup', popupFeatures);
	}
});
