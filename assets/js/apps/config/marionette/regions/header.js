import Mn from 'backbone.marionette';

module.exports = Mn.Region.extend({

	pageWrap: $('#page-wrap'),

	onShow: function(view) {
		this.pageWrap.addClass('with-header');
	},

	onEmpty: function(view) {
		this.pageWrap.removeClass('with-header');
	}
});
