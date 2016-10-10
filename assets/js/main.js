const App = require('app');
const Backbone = require('backbone');
const HeaderApp = require('apps/header/header_app');
const SplashApp = require('apps/splash/splash_app');
const TestApp = require('apps/test/test_app');
const UsersApp = require('apps/users/users_app');
const StaticApp = require('apps/static/static_app');
const LoaderApp = require('apps/loader/loader_app');
const Notify = require('common/notify');
const Media = require('common/media');
const User = require('entities/user');
const AjaxUtility = require('common/ajax.utility');
const Environment = require('common/environment');
const Settings = require('settings');
const nls = require('nls/nls');
const attachFastClick = require('fastclick');

require('rAF-polyfill');
require('date-polyfill');
require('storage-polyfill');
require('trim-polyfill');
require('JSON2');
require('bootstrap');

const Radio = require('backbone.radio');
const GC = Radio.channel('global');


// Attach fast click (removes 300ms delay between touchend and mouse click events)
attachFastClick.attach(document.body);

// Before start tasks
App.on('before:start', function(options) {
	// Enable CORS for xhr requests
	if (Settings.EnableCORS) {
		AjaxUtility.enableCORS();
	}
	// Add enironment classes to body
	Environment.addEnvironmentClasses();
	// Get default locale from settings
	const { DefaultLocale } = Settings;
	// Set polyglot locale
	GC.request('nls:set:locale', DefaultLocale);
	console.info('App: pre-start tasks complete.');
});

// Core init routine -> will result in the triggering of a route
App.on('start', function(options) {
	if (!Backbone.history) {
		return;
	}

	const fetchingLoggedUser = GC.request('loggedUser:entity');

	// Fetch logged user before anything else
	fetchingLoggedUser.done(function(user) {
		// User was found
		if (Boolean(user)) {
			App.initForMember(user);
		}
		// User is a guest
		else {
			App.initForGuest();
		}
	});

	fetchingLoggedUser.fail(function() {
		App.initForGuest();
	});

	fetchingLoggedUser.always(function() {
		// Manually start header app
		GC.trigger('header:render');
		// Detect browser back/fwd buttons and close dialog & overlay
		Backbone.history.on('route', function() {
			App.rootView.getRegion('dialog').closeModal();
			App.rootView.getRegion('overlay').closeOverlay();
		});
		console.info('App: post-start tasks complete.');
	});
});

// Don't start app if running as mobile app (i.e. over cordova)
if (!Environment.isMobileApp()) {
	App.start();
	console.info('App Started.');
}
