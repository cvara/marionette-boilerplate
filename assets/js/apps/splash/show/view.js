define([
	'app',
	'ejs!apps/splash/show/templates/splash'
], function(App, splashTpl) {

	App.module('SplashApp.Show.View', function(View, App, Backbone, Marionette, $, _) {

		View.Splash = Marionette.ItemView.extend({
			className: 'splash-container',
			template: splashTpl
		});
	});

	return App.SplashApp.Show.View;
});