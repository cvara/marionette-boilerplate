import Mn from 'backbone.marionette';
import Env from 'common/environment';
import overlayTpl from './templates/overlay';


export default Mn.Region.extend({

	isOpen: false,

	_gracefullyShow: function(view) {
		this.$el.addClass('open');
		view.triggerMethod('overlay:show');
		this.triggerMethod('overlay:show');
		console.info('Overlay: show');
		if (Env.enableTransitions) {
			this.$el.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', () => {
				console.info('Overlay: shown');
				view.triggerMethod('overlay:shown');
				this.triggerMethod('overlay:shown');
				this.$el.off();
			});
		} else {
			console.info('Overlay: shown');
			view.triggerMethod('overlay:shown');
			this.triggerMethod('overlay:shown');
			this.$el.off();
		}
	},

	_gracefullyHide: function(maintainState) {
		const view = this.currentView;
		if (view.getOption('stateful') && !maintainState) {
			this.trigger('history:back');
		}
		this.$el.removeClass('open');
		view.triggerMethod('overlay:hide');
		this.triggerMethod('overlay:hide');
		console.info('Overlay: hide');
		if (Env.enableTransitions) {
			this.$el.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', () => {
				console.info('Overlay: hidden');
				this.empty();
				this.$el.empty();
				this.$el.off();
				this.triggerMethod('overlay:hidden');
			});
		} else {
			console.info('Overlay: hidden');
			this.empty();
			this.$el.empty();
			this.$el.off();
			this.triggerMethod('overlay:hidden');
		}
	},

	attachHtml: function(view) {
		const title = view.getOption('overlayTitle') || '';
		const noHeader = Boolean(view.getOption('overlayDisableHeader'));

		const html = overlayTpl({ title, noHeader });

		const $overlayEl = $($.parseHTML(html));

		$overlayEl.find('.overlay-body').append(view.el);

		this.el.appendChild($overlayEl[0]);
	},

	onShow: function(self, view) {
		this._gracefullyShow(view);
		// When overlay-header 'close' button is clicked
		this.$el.find('.overlay-header .close').click(() => {
			this._gracefullyHide();
		});
		// When the view shown in the overlay triggers a close event
		view.on('close', () => {
			this._gracefullyHide();
		});
	},

	onEmpty: function() {
		this.$el.empty();
	},

	onOverlayOpen: function() {
		this.isOpen = true;
	},

	onOverlayClose: function() {
		this.isOpen = false;
	},

	// This method is used when other modules wish
	// to close the dialog they have opened
	closeOverlay: function(maintainState) {
		if (this.hasView()) {
			this._gracefullyHide(maintainState);
		}
	},

	hasDescendant: function(view) {
		if (view.$el === this.$el) {
			return true;
		}
		if (!view._parent) {
			return false;
		}
		return this.hasDescendant(view._parent);
	}
});
