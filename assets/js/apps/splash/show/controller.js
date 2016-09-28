var App = require('app');
var View = require('apps/splash/show/view');


App.module('SplashApp.Show', function(Show, App, Backbone, Marionette, $, _) {

	Show.Controller = {
		showSplash: function() {

			var splashView = new View.Splash();

			App.rootView.showChildView('main', splashView);
		}
	};
});

module.exports = App.SplashApp.Show.Controller;
