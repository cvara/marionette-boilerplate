import Mn from 'backbone.marionette';

module.exports = Mn.Region.extend({

	initialize: function() {

	},

	onShow: function() {
		window.scrollTo(0, 0);
	}
});
