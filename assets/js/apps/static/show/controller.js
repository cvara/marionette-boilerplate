var App = require('app');
var View = require('./view');


var Controller = {};

Controller.showStaticView = function(args) {
	var view = args.view;
	var staticView = new View.StaticView({
		view: view
	});
	App.rootView.showChildView('main', staticView);
};

module.exports = Controller;
