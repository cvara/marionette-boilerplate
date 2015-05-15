define([
	'app',
	'apps/splash/show/view'
], function(App, View) {

	App.module('SplashApp.Show', function(Show, App, Backbone, Marionette, $, _) {

		Show.Controller = {
			showSplash: function() {

				var splashView = new View.Splash();

				App.rootView.showChildView('main', splashView);
			}
		};
	});

	return App.SplashApp.Show.Controller;
});