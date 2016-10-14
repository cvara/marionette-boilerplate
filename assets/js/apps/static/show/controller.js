import App from 'app';
import View from './view';


var Controller = {};

Controller.showStaticView = function(args) {
	var view = args.view;
	var staticView = new View.StaticView({
		view: view
	});
	App.rootView.showChildView('main', staticView);
};

module.exports = Controller;
