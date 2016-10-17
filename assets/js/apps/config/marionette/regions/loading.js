import Mn from 'backbone.marionette';

export default Mn.Region.extend({

	loadingRegion: true,

	onShow: function(view) {
		this.$el.show();
	},

	onEmpty: function(view) {
		this.$el.hide();
	}
});
