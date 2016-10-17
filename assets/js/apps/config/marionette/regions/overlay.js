import Mn from 'backbone.marionette';
import Env from 'common/environment';


export default Mn.Region.extend({

	isOpen: false,

	_addOverlayMarkup: function(view) {
		var el = view.$el;
		var overlayTitle = view.getOption('overlayTitle') || '';
		var disableHeader = Boolean(view.getOption('overlayDisableHeader'));

		// Prepare overlay container
		var overlayContainer = $('<div class="overlay' + (disableHeader ? ' no-header' : '') + '"></div>');

		// Wrap view el in overlay container
		el.wrap(overlayContainer);

		if (!disableHeader) {
			// Create & attach header html
			const overlayHeader = [];
			overlayHeader.push('<div class="overlay-header">',
				'<button type="button" class="close" data-dismiss="overlay">',
				'<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>',
				'</button>',
				'<h4 class="overlay-title">', overlayTitle, '</h4>',
				'</div>');
			el.before(overlayHeader.join(''));
		}
	},

	_gracefullyShow: function(view) {
		$('body').css('overflow-y', 'hidden');
		$('#main-region').addClass('shadowed');
		this.$el.addClass('open');
		if (Env.enableTransitions) {
			this.$el.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', () => {
				view.triggerMethod('overlay:open');
				this.triggerMethod('overlay:open');
				this.$el.off();
			});
		} else {
			view.triggerMethod('overlay:open');
			this.triggerMethod('overlay:open');
			this.$el.off();
		}
	},

	_gracefullyHide: function(maintainState) {
		const view = this.currentView;
		if (view.getOption('stateful') && !maintainState) {
			this.trigger('history:back');
		}
		this.$el.removeClass('open');
		if (Env.enableTransitions) {
			this.$el.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', () => {
				console.info('transition end');
				this.empty();
				this.$el.empty();
				this.$el.off();
				this.triggerMethod('overlay:close');
			});
		} else {
			console.info('transition end');
			this.empty();
			this.$el.empty();
			this.$el.off();
			this.triggerMethod('overlay:close');
		}

		$('body').css('overflow-y', 'auto');
		$('#main-region').removeClass('shadowed');
	},

	initOverlay: function(view) {
		this._addOverlayMarkup(view);
		// When overlay 'close' button is clicked
		this.$el.find('.close').click(() => {
			this._gracefullyHide();
		});
		// When the view shown in the overlay triggers a close event
		view.on('close', () => {
			this._gracefullyHide();
		});
	},

	onShow: function(view) {
		this.initOverlay(view);
		this._gracefullyShow(view);
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
