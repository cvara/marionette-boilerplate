define([
	'app',
	'apps/config/spinner/options',
	'apps/loader/show/templates/loader.main',
	'spin.jquery'
], function(App, SpinnerOptions, loaderMainTpl) {

	App.module('LoaderApp.Show.View', function(View, App, Backbone, Marionette, $, _) {

		View.Loader = Marionette.ItemView.extend({
			template: loaderMainTpl,
			// isLoading: true, // mark the view so that regions can recognize it
			className: 'main-loading-container',

			ui: {
				jsPreloader: '.js-preloader'
			},

			onShow: function() {
				this.ui.jsPreloader.removeClass('hidden').spin(SpinnerOptions.main);
			},

			onBeforeDestroy: function() {
				this.ui.jsPreloader.addClass('hidden').spin(false);
			}
		});

	});

	return App.LoaderApp.Show.View;
});