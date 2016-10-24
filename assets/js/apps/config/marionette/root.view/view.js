import Mn from 'backbone.marionette';
import HeaderRegion from 'apps/config/marionette/regions/header';
import MainRegion from 'apps/config/marionette/regions/main';
import DialogRegion from 'apps/config/marionette/regions/dialog';
import LoadingRegion from 'apps/config/marionette/regions/loading';
import OverlayRegion from 'apps/config/marionette/regions/overlay';
import rootViewTpl from './templates/root.view';

export const Body = Mn.View.extend({
	el: 'body',

	initialize: function() {
		this.addRegion('app', this.getOption('rootEl'));
	},

	onChildviewOverlayShow: function() {
		this.$el.css('overflow-y', 'hidden');
	},

	onChildviewOverlayHide: function() {
		this.$el.css('overflow-y', 'auto');
	}
});

export const Layout = Mn.View.extend({
	id: 'page-wrap',
	template: rootViewTpl,

	regions: {
		header  : HeaderRegion.extend({ el: '#header-region'}),
		main    : MainRegion.extend({el: '#main-region'}),
		dialog  : DialogRegion.extend({el: '#dialog-region'}),
		loading : LoadingRegion.extend({el: '#loading-region'}),
		overlay : OverlayRegion.extend({el: '#overlay-region'})
	},

	initialize: function() {
		this.getRegion('header').on('show', () => {
			this.$el.addClass('with-header');
		});
		this.getRegion('header').on('empty', () => {
			this.$el.removeClass('with-header');
		});
		this.getRegion('overlay').on('overlay:show', () => {
			this.triggerMethod('overlay:show');
			this.getRegion('main').$el.addClass('shadowed');
		});
		this.getRegion('overlay').on('overlay:hide', () => {
			this.triggerMethod('overlay:hide');
			this.getRegion('main').$el.removeClass('shadowed');
		});
	}
});
