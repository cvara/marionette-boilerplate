import Mn from 'backbone.marionette';
import Backbone from 'backbone';
import Navigator from 'navigator';
import HeaderRegion from 'apps/config/marionette/regions/header';
import MainRegion from 'apps/config/marionette/regions/main';
import DialogRegion from 'apps/config/marionette/regions/dialog';
import LoadingRegion from 'apps/config/marionette/regions/loading';
import OverlayRegion from 'apps/config/marionette/regions/overlay';
import ValidatorConfig from 'apps/config/validator/validator';
import Settings from 'settings';
import Radio from 'backbone.radio';
const GC = window.GC = Radio.channel('global');


// Initialize Marionette Application
// -------------------------------------------------------------
// The application is also registered as a global variable,
// so that it can be referenced from inside Underscore templates
const App = window.App = new Mn.Application();



// Our custom region classes
// -------------------------------------------------------------
const headerRegion = HeaderRegion.extend({
	el: '#header-section'
});
const mainRegion = MainRegion.extend({
	el: '#main-region'
});
const dialogRegion = DialogRegion.extend({
	el: '#dialog-region'
});
const loadingRegion = LoadingRegion.extend({
	el: '#loading-region'
});
const overlayRegion = OverlayRegion.extend({
	el: '#overlay-region'
});


// The root LayoutView of our app within the context of 'body'
// -------------------------------------------------------------
// Our custom region classes are attached to this LayoutView
// instead of our app object.
const RootView = Mn.View.extend({
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


// Create Navigator & attach it to App for accessibility
// -------------------------------------------------------------
App.Navigator = App.Nav = new Navigator();


// URL Requested By Guest
// -------------------------------------------------------------
// This is the url requested by current guest user, before
// being redirected due to access rights
App.requestedGuestUrl = false;

// Inits app for member
App.initForMember = (user) => {
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
App.initForGuest = () => {
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
	if (!!refresh) {
		GC.trigger('refresh:mainRegion');
	}
});

// Get notified when user logs out
GC.on('logout', () => {
	App.isLoggedIn = false;
	GC.trigger('splash:show');
});

// Get notified when user logs out
GC.on('close:overlapping:interfaces', maintainState => {
	App.rootView.getRegion('dialog').closeModal();
	App.rootView.getRegion('overlay').closeOverlay(maintainState);  // close without changing state
});

// Listen to 'history:back' events fired from overlay region
App.listenTo(App.rootView.getRegion('overlay'), 'history:back', () => {
	App.Nav.navigatePrevious();
});

export default App;
