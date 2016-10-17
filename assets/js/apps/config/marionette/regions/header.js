import Mn from 'backbone.marionette';

export default Mn.Region.extend({

	pageWrap: $('#page-wrap'),

	onShow: function(view) {
		this.pageWrap.addClass('with-header');
	},

	onEmpty: function(view) {
		this.pageWrap.removeClass('with-header');
	}
});
