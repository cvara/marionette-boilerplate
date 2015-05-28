define(['app', 'apps/splash/show/controller'], function(App, ShowController) {

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
				App.executeAction('SplashApp', ShowController.showSplash);
				App.execute('sidebar:deactivate:all');
			}
		};

		// Event Listeners
		// ------------------
		App.on('splash:show', function() {
			App.navigate('splash');
			API.showSplash();
		});

		// Install Router
		// ------------------
		new SplashAppRouter.Router({
			controller: API
		});
	});

	return App.Routers.SplashApp;
});