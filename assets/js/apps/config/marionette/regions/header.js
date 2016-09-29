var Marionette = require('backbone.marionette');

module.exports = Marionette.Region.extend({

	pageWrap: $('#page-wrap'),

	onShow: function(view) {
		console.log('yo');
		this.pageWrap.addClass('with-header');
	},

	onEmpty: function(view) {
		this.pageWrap.removeClass('with-header');
	}
});
