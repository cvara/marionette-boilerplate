import Mn from 'backbone.marionette';
import Backbone from 'backbone';
import RootViewSetup from 'apps/config/marionette/root.view/setup';
import Navigator from 'navigator';
import ValidatorConfig from 'apps/config/validator/validator';
import Settings from 'settings';
import Radio from 'backbone.radio';
const GC = window.GC = Radio.channel('global');


// Initialize Marionette Application
// -------------------------------------------------------------
// The application is also registered as a global variable,
// so that it can be referenced from inside Underscore templates
const App = window.App = new Mn.Application();


// Attach the rootView to the App object for easier access
// -------------------------------------------------------------
App.rootView = RootViewSetup('#app');

// Create Navigator & attach it to App for accessibility
// -------------------------------------------------------------
App.Navigator = App.Nav = new Navigator();


// Login Indicator
// -------------------------------------------------------------
App.isLoggedIn = false;


// URL Requested By Guest
// -------------------------------------------------------------
// This is the url requested by current guest user, before
// being redirected due to access rights
App.requestedGuestUrl = false;

// Inits app for member
App.initForMember = function (user) {
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
App.initForGuest = function () {
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
		}
	}
};

GC.on('refresh:mainRegion', () => {
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
GC.on('login', (user, refresh) => {
	console.info('User logged in. Role: ', user.get('role'));
	// mark user as logged in
	App.isLoggedIn = true;
	if (refresh) {
		GC.trigger('refresh:mainRegion');
	}
});

// Get notified when user logs out
GC.on('logout', () => {
	App.isLoggedIn = false;
	GC.trigger('splash:show');
});

// Listen to 'history:back' events fired from overlay region
App.listenTo(App.rootView.getRegion('overlay'), 'history:back', () => {
	App.Nav.navigatePrevious();
});

export default App;
