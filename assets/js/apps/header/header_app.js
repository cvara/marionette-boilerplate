var App = require('app');
var ShowController = require('apps/header/show/controller');
var Radio = require('backbone.radio');
var GlobalChannel = Radio.channel('global');


// Header API
// ------------------
var API = {
	showHeader: function() {
		ShowController.showHeader();
	}
};


// Event Listeners
// ------------------
GlobalChannel.on('header:render', function() {
	API.showHeader();
});

GlobalChannel.on('login', function(user, refresh) {
	API.showHeader();
});

GlobalChannel.on('logout', function() {
	API.showHeader();
});


module.exports = API;
