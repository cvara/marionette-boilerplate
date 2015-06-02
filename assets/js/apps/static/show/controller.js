var App = require('app');
var View = require('apps/static/show/view');


App.module('StaticApp.Show', function(Show, App, Backbone, Marionette, $, _) {

	Show.Controller = {
		showStaticView: function(args) {
			var view = args.view;
			var staticView = new View.StaticView({
				view: view
			});
			App.rootView.showChildView('main', staticView);
		}
	};
});

module.exports = App.StaticApp.Show.Controller;