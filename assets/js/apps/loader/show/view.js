var App = require('app');
var SpinnerOptions = require('apps/config/spinner/options');
var loaderMainTpl = require('apps/loader/show/templates/loader.main');
var Spinner = require('spin.js');


App.module('LoaderApp.Show.View', function(View, App, Backbone, Marionette, $, _) {

	View.Loader = Marionette.ItemView.extend({
		template: loaderMainTpl,
		// isLoading: true, // mark the view so that regions can recognize it
		className: 'main-loading-container',

		ui: {
			jsPreloader: '.js-preloader'
		},

		onShow: function() {
			this.ui.jsPreloader.removeClass('hidden');
			this.spinner = new Spinner(SpinnerOptions.main).spin(this.ui.jsPreloader[0]);
		},

		onBeforeDestroy: function() {
			this.ui.jsPreloader.addClass('hidden');
			this.spinner.stop();
		}
	});

});

module.exports = App.LoaderApp.Show.View;
