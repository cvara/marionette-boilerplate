import Mn from 'backbone.marionette';

export default Mn.Region.extend({

	initialize: function() {

	},

	onShow: function() {
		window.scrollTo(0, 0);
	}
});
