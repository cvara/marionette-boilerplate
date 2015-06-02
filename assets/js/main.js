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
require('rAF-polyfill');
require('date-polyfill');
require('storage-polyfill');
require('trim-polyfill');
require('localstorage-polyfill');
require('json2');
require('bootstrap');


console.clear();

App.on('before:start', function(options) {
	// AjaxUtility.setupCSRFToken();
	if (App.request('setting', 'EnableCORS')) {
		AjaxUtility.enableCORS();
	}
	console.info('App: pre-start tasks complete.');
});

// Core init routine -> will result in the triggering of a route
App.on('start', function(options) {
	if (!Backbone.history) {
		return;
	}

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

App.start();
console.info('App Started.');