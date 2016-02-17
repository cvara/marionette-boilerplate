var App = require('app');
var HeaderApp = require('apps/header/header_app');
var SidebarApp = require('apps/sidebar/sidebar_app');
var SplashApp = require('apps/splash/splash_app');
var UsersApp = require('apps/users/users_app');
var StaticApp = require('apps/static/static_app');
var LoaderApp = require('apps/loader/loader_app');
var Notify = require('common/notify');
var Mailer = require('mailer/mailer');
var Cache = require('cache/cache');
var Moment = require('moment');
var AjaxUtility = require('common/ajax.utility');
var Environment = require('common/environment');
var nls = require('nls/nls');
var attachFastClick = require('fastclick');
require('rAF-polyfill');
require('date-polyfill');
require('storage-polyfill');
require('trim-polyfill');
require('localstorage-polyfill');
require('console-stub');
require('json2');
require('bootstrap');



// Attach fast click (removes 300ms delay between touchend and mouse click events)
attachFastClick.attach(document.body);

// Before start tasks
App.on('before:start', function(options) {
	// Enable CORS for xhr requests
	if (App.request('setting', 'EnableCORS')) {
		AjaxUtility.enableCORS();
	}
	// Add enironment classes to body
	Environment.addEnvironmentClasses();
	// Get default locale from settings
	var defaultLocale = App.request('setting', 'DefaultLocale');
	// Set polyglot locale
	App.request('nls:set:locale', defaultLocale);
	// Set moment locale
	Moment.locale(defaultLocale);
	console.info('App: pre-start tasks complete.');
});

// Core init routine -> will result in the triggering of a route
App.on('start', function(options) {
	if (!Backbone.history) {
		return;
	}

	// Detect browser back/fwd buttons and update Navigate History
	Backbone.history.on('route', function(route, params) {
		// Update our history stack
		App.NavigateHistory.push({
			route: App.getCurrentRoute(),
			options: route.options
		});
	});

	var fetchingLoggedUser = App.request('cache:fetch:logged:user');

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
		HeaderApp.start();
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