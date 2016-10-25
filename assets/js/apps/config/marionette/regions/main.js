import App from 'app';
import Mn from 'backbone.marionette';
import Radio from 'backbone.radio';
const GC = Radio.channel('global');

export default Mn.Region.extend({

	scrollPosition: {},

	initialize: function() {
		// Save scroll position each time the user navigates
		GC.on('before:navigate', (curRoute, nextRoute) => {
			this.scrollPosition[curRoute] = $(window).scrollTop();
			console.log('save scrollPosition: ', this.scrollPosition[curRoute]);
		});
	},

	onShow: function(self, view) {
		// Get last known scroll position for this route
		var pos = this.scrollPosition[App.Nav.getCurrentRoute()] || 0;
		// Scroll to it
		$(window).scrollTop(pos);
		console.log('restore scrollPosition: ', pos);
		// In case the view manually requests to restore scroll position again later
		view.on('restore:scroll:position', () => {
			$(window).scrollTop(pos);
		});
	}
});
