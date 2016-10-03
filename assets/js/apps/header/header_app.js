var ShowController = require('apps/header/show/controller');
var Radio = require('backbone.radio');
var GC = Radio.channel('global');


// Header API
// ------------------
var API = {
	showHeader: function() {
		ShowController.showHeader();
	}
};


// Event Listeners
// ------------------
GC.on('header:render', function() {
	API.showHeader();
});

GC.on('login', function(user, refresh) {
	API.showHeader();
});

GC.on('logout', function() {
	API.showHeader();
});


module.exports = API;
