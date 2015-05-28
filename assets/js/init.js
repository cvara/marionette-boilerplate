define([
	'app',
	'apps/header/header_app',
	'apps/sidebar/sidebar_app',
	'apps/splash/splash_app',
	'apps/users/users_app',
	'apps/static/static_app',
	'common/notify',
	'mailer/mailer',
	'cache/cache'
], function(
	App,
	HeaderApp,
	SidebarApp,
	SplashApp,
	UsersApp,
	StaticApp,
	Notify,
	Mailer,
	Cache
) {

	return {
		init: function() {
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
		}
	};
});