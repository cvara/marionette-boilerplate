var App = require('app');
var Mn = require('backbone.marionette');
var SpinnerOptions = require('apps/config/spinner/options');
var loaderMainTpl = require('apps/loader/show/templates/loader.main');
var Spinner = require('spin.js');


var View = {};


View.Loader = Mn.View.extend({
	template: loaderMainTpl,
	// isLoading: true, // mark the view so that regions can recognize it
	className: 'main-loading-container',

	ui: {
		jsPreloader: '.js-preloader'
	},

	onRender: function() {
		this.ui.jsPreloader.removeClass('hidden');
		this.spinner = new Spinner(SpinnerOptions.main).spin(this.ui.jsPreloader[0]);
	},

	onBeforeDestroy: function() {
		this.ui.jsPreloader.addClass('hidden');
		this.spinner.stop();
	}
});

module.exports = View;
