define([
	'app',
	'apps/header/show/view',
	'common/authenticate',
	'cache/cache'
], function(App, View, Authenticate) {

	App.module('HeaderApp.Show', function(Show, App, Backbone, Marionette, $, _) {

		Show.Controller = {
			showHeader: function() {
				var user = App.request('cache:get:logged:user');
				console.log('App.HeaderApp: fetched user from cache: ', user);

				if (user !== false && !(user instanceof Backbone.Model)) {
					user = App.request('empty:user:entity');
				}

				var header = new View.Header({
					model: user
				});

				header.on('show:home', function() {
					if (user) {
						App.showLanding(user);
					} else {
						App.trigger('splash:show');
					}
				});

				header.on('logout:user', function() {
					Authenticate.logout().done(function() {
						App.trigger('logout');
					});
				});

				App.rootView.showChildView('header', header);
			}
		};
	});

	return App.HeaderApp.Show.Controller;
});