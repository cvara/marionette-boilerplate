import App from 'app';
import Utility from 'common/utility';
import Radio from 'backbone.radio';
const GC = Radio.channel('global');

// Use local proxy for ga
const ga = window.ga;
// Is app running on production?
const runningOnProduction = !/localhost/.test(location.href);
// Should we enable tracking ?
const enableTracking = Boolean(ga) && runningOnProduction;

const API = {

	// Sends page hits to analytics.
	// - url   : the page url (for one page app can be the url fragment, i.e. "/#artist/minddeparture")
	// - title : (optional) the page title (i.e. "Artist Page | Mind Departure")
	trackPageView(url, title) {
		url = App.decode(url);
		title = Utility.toTitleCase(App.decode(title));
		console.info('Analytics: tracking pageview: ', url, '|', title);
		if (!enableTracking) {
			return;
		}
		// Sets the page value on the tracker
		ga('set', 'page', url);
		// Sending the pageview no longer requires passing the page
		// value since it's now stored on the tracker object
		ga('send', {
			hitType: 'pageview',
			title: title
		});
	},

	// Sends events to analytics, such as button clicks.
	// - category : the event category (i.e. "button")
	// - action   : the event action (i.e. "click")
	// - label    : (optional) the event labe (i.e. the label of a button clicked, "Vote")
	// - value    : (optional) event related value (i.e. number of times a button was clicked)
	// - opts     : (optional) extra analytics options object (i.e. "nonInteraction")
	trackEvent(category, action, label, value, opts) {
		console.info('Analytics: tracking event: ', category, '|', action, '|', label, '|', value, '|', opts);
		if (!enableTracking) {
			return;
		}
		ga('send', 'event', category, action, label, value, opts);
	}
};

GC.on('analytics:track:pageview', (...args) => {
	API.trackPageView(...args);
});

GC.on('analytics:track:event', (...args) => {
	API.trackEvent(...args);
});

export default API;
