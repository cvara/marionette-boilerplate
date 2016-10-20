import App from 'app';
import Mn from 'backbone.marionette';
import SpinnerOptions from 'apps/config/spinner/options';
import loaderMainTpl from './templates/loader.main';
import Spinner from 'spin.js';


const View = {};


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

export default View;
