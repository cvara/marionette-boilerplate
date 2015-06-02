var App = require('app');
var splashTpl = require('apps/splash/show/templates/splash');


App.module('SplashApp.Show.View', function(View, App, Backbone, Marionette, $, _) {

	View.Splash = Marionette.ItemView.extend({
		className: 'splash-container',
		template: splashTpl
	});
});

module.exports = App.SplashApp.Show.View;