var Mn = require('backbone.marionette');

module.exports = Mn.Region.extend({

	initialize: function() {

	},

	onShow: function() {
		window.scrollTo(0, 0);
	}
});
