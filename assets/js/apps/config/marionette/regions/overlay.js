var Marionette = require('marionette');
require('bootstrap');

module.exports = Marionette.Region.extend({

	animateDuration: 500,

	animateFrom: {
		'left': '-100%',
		// 'opacity': 0.5
	},

	animateTo: {
		'left': '0',
		// 'opacity': 1
	},

	_addOverlayMarkup: function(view) {
		var self = this;
		var el = view.$el;
		var overlayTitle = view.getOption('overlayTitle') || '';

		el.wrap('<div class="overlay"></div>');

		if (view.getOption('overlayDisableHeader') !== true) {
			var overlayHeader = [];
			overlayHeader.push('<div class="overlay-header">',
				'<button type="button" class="close" data-dismiss="overlay">',
				'<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>',
				'</button>',
				'<h4 class="overlay-title">', overlayTitle, '</h4>',
				'</div>');

			el.before(overlayHeader.join(''));
		}
	},

	_gracefullyShow: function() {
		$('body').css('overflow', 'hidden');
		this.$el
			.css( _.extend(this.animateFrom, { 'display': 'block'}) )
			.animate(this.animateTo, this.animateDuration);
	},

	_gracefullyHide: function() {
		this.$el.animate(this.animateFrom, this.animateDuration, function(){
			this.empty();
			this.$el.hide().empty();
			$('body').css('overflow', 'auto');
		}.bind(this));
	},

	initOverlay: function(view) {
		this._addOverlayMarkup(view);
		this.$el.find('.close').click(function() {
			this.$el.empty();
		}.bind(this));
	},

	onShow: function(view) {
		this.initOverlay(view);
		this._gracefullyShow();
	},

	onEmpty: function() {
		this.$el.empty();
	},

	// This method is used when other modules wish
	// to close the dialog they have opened
	closeOverlay: function() {
		if (!!this.currentView) {
			this._gracefullyHide();
		}
	}
});