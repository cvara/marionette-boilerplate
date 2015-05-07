define([
	'app',
	'apps/static/show/view'
], function(
	App,
	View
) {

	App.module('StaticApp.Show', function(Show, App, Backbone, Marionette, $, _) {

		Show.Controller = {
			showStaticView: function(args) {
				var view = args.view;
				var staticView = new View.StaticView({
					view: view
				});
				App.mainRegion.show(staticView);
			}
		};
	});

	return App.StaticApp.Show.Controller;
});