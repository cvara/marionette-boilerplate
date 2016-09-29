var Marionette = require('backbone.marionette');

module.exports = Marionette.Region.extend({

	initialize: function() {

	},

	onShow: function() {
		window.scrollTo(0, 0);
	}
});
