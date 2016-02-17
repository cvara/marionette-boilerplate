var Marionette = require('marionette');

module.exports = Marionette.Region.extend({

	loadingRegion: true,

	onShow: function(view) {
		this.$el.show();
	},

	onEmpty: function(view) {
		this.$el.hide();
	}
});