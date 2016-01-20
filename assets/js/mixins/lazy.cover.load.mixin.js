var App = require('app');
require('jquery.isonscreen');
require('jquery-ui.core');


module.exports = {

	ui: {
		lazyImage: '.lazy-image'
	},

	onRender: function() {
		if (!App.request('setting', 'EnableLazyImageLoading')) {
			return;
		}
		if (this.ui.lazyImage.length === 0) {
			return;
		}
		this.lazyUrl = this.ui.lazyImage.css('background-image').match(/\((.*?)\)/)[1].replace(/[\'\"]/g, '');
		this.ui.lazyImage.css('background-image', '');
	},

	onAttach: function() {
		if (!App.request('setting', 'EnableLazyImageLoading')) {
			return;
		}
		var overlayRegion = App.rootView.getRegion('overlay');
		// view inside overlay: wait for overlay to open
		if (overlayRegion.hasDescendant(this)) {
			// overlay is already open
			if (overlayRegion.isOpen) {
				this.initLazyLoad();
			}
			// wait for it
			else {
				this.listenTo(overlayRegion, 'overlay:open', function() {
					this.initLazyLoad();
				});
			}
		}
		// view outside overlay: direct init
		else {
			this.initLazyLoad();
		}
	},

	initLazyLoad: function() {
		this.scrollParent = this.getScrollingParent();
		this.scrollParent.on('scroll.' + this.cid, _.throttle(function() {
			this._attemptLazyLoad();
		}.bind(this), 200));
		this.on('stuffing:done', this._attemptLazyLoad);
		this._attemptLazyLoad();
	},

	getScrollingParent: function() {
		// jquery-ui utility
		var scrollParent = this.$el.scrollParent();
		// replace body with window
		return scrollParent.prop('tagName') === 'BODY' ? $(window) : scrollParent;
	},

	_attemptLazyLoad: function() {
		var self = this;
		var x = 1;   // Require full width to be viewed
		var y = 0; // Require 10% of height to be viewed
		if (self.ui.lazyImage.isOnScreen(x, y)) {
			// Stop listening for scroll & 'stuffing:done'
			self.scrollParent.off('scroll.' + self.cid);
			self.off('stuffing:done', this._attemptLazyLoad);
			// Wait for image to load on browser using a dummy img element
			var img = new Image();
			img.onload = function() {
				img = null;
				self.ui.lazyImage
					.hide()
					.css('background-image', 'url(' + self.lazyUrl + ')')
					.fadeIn();
			};
			img.src =  self.lazyUrl;
		}
	},

	onBeforeDestroy:  function() {
		if (this.scrollParent) {
			this.scrollParent.off('scroll.' + this.cid);
		}
	}
};