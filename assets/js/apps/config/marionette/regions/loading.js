var Mn = require('backbone.marionette');

module.exports = Mn.Region.extend({

	loadingRegion: true,

	onShow: function(view) {
		this.$el.show();
	},

	onEmpty: function(view) {
		this.$el.hide();
	}
});
