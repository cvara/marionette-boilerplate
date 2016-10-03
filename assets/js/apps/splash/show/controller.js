var App = require('app');
var View = require('./view');


var Controller = {};

Controller.showSplash = function() {
	var splashView = new View.Splash();
	App.rootView.showChildView('main', splashView);
};

module.exports = Controller;
