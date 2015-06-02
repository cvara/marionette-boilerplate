var Marionette = require('marionette');

module.exports = Marionette.Region.extend({

	pageWrap: $('#page-wrap'),

	onShow: function(view) {
		this.pageWrap.addClass('with-header');
	},

	onEmpty: function(view) {
		this.pageWrap.removeClass('with-header');
	}
});