// The controller is a NOT a top level requirement, since we must wait before
// the user navigates to a page managed by this app until we 'require' it
define(['app'], function(App) {

	App.module('SplashApp', function(SplashApp, App, Backbone, Marionette, $, _) {
		SplashApp.startWithParent = false;

		SplashApp.onStart = function() {
			console.info('starting SplashApp');
		};

		SplashApp.onStop = function() {
			console.info('stopping SplashApp');
		};
	});

	App.module('Routers.SplashApp', function(SplashAppRouter, App, Backbone, Marionette, $, _) {

		// Splash Router
		// ------------------
		SplashAppRouter.Router = Marionette.AppRouter.extend({
			appRoutes: {
				'splash': 'showSplash'
			}
		});

		// Splash API
		// ------------------
		var API = {
			showSplash: function() {
				require(['apps/splash/show/controller'], function(Controller) {
					App.executeAction('SplashApp', Controller.showSplash);
					App.execute('sidebar:deactivate:all');
				});
			}
		};

		// Event Listeners
		// ------------------
		App.on('splash:show', function() {
			App.navigate('splash');
			API.showSplash();
		});

		App.addInitializer(function() {
			new SplashAppRouter.Router({
				controller: API
			});
		});
	});

	return App.Routers.SplashApp;
});