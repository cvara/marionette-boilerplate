var App = require('app');
var Backbone = require('backbone');
var View = require('apps/header/show/view');
var Authenticate = require('common/authenticate');
var LoggedUser = require('entities/logged.user');
var Radio = require('backbone.radio');
var GlobalChannel = Radio.channel('global');


var Controller = {};

Controller.showHeader = function() {

	var user;

	var headerView = new View.Header();

	headerView.on('show:home', function() {
		App.showLanding(user);
	});

	headerView.on('logout:user', function() {
		Authenticate.logout().done(function() {
			GlobalChannel.trigger('logout');
		});
	});

	GlobalChannel.request('loggedUser:entity').then(function(loggedUser) {
		user = loggedUser;
		headerView.model = user;
		headerView.render();
	});

	App.rootView.showChildView('header', headerView);

};

module.exports = Controller;
