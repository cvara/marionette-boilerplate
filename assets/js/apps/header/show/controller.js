var App = require('app');
var Backbone = require('backbone');
var View = require('apps/header/show/view');
var Authenticate = require('common/authenticate');
var LoggedUser = require('entities/logged.user');
var Radio = require('backbone.radio');
var GC = Radio.channel('global');


var Controller = {};

Controller.showHeader = function() {

	var user;

	var headerView = new View.Header();

	headerView.on('show:home', function() {
		App.Nav.showLanding(user);
	});

	headerView.on('logout:user', function() {
		Authenticate.logout().done(function() {
			GC.trigger('logout');
		});
	});

	GC.request('loggedUser:entity').then(function(loggedUser) {
		user = loggedUser;
		headerView.model = user;
		headerView.render();
	});

	App.rootView.showChildView('header', headerView);

};

module.exports = Controller;
