var App = require('app');
var View = require('./view');


var Controller = {};

Controller.showTest = function() {
	var testView = new View.Test();
	App.rootView.showChildView('main', testView);
};

module.exports = Controller;
