require([
	'app',
	'common/ajax.utility',

	'apps/header/header_app',
	'apps/sidebar/sidebar_app',
	'apps/splash/splash_app',
	'apps/users/users_app',
	'apps/static/static_app',
	'apps/loader/loader_app',

	'common/notify',
	'mailer/mailer',
	'cache/cache',

	'rAF-polyfill',
	'date-polyfill',
	'storage-polyfill',
	'trim-polyfill',
	'localstorage-polyfill',
	'json2',

	'bootstrap',
	'moment'
], function(App, AjaxUtility, HeaderApp, SidebarApp) {

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
});