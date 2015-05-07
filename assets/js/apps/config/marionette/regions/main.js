define(['marionette'], function(Marionette) {

	Marionette.Region.Main = Marionette.Region.extend({

		initialize: function() {

		},

		onShow: function() {
			window.scrollTo(0, 0);
		}
	});

	return Marionette.Region.Main;
});