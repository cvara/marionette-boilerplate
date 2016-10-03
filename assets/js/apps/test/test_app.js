var App = require('app');
var Mn = require('backbone.marionette');
var Radio = require('backbone.radio');
var GC = Radio.channel('global');


// Router
// ------------------
var Router = Mn.AppRouter.extend({
	appRoutes: {
		'test': 'showTest'
	}
});

// API
// ------------------
var API = {
	showTest: function() {
		require.ensure(['./show/controller'], function(require) {
			var ShowController = require('./show/controller');
			ShowController.showTest();
		});
	}
};

// Event Listeners
// ------------------
GC.on('test:show', function() {
	App.Nav.navigate('test');
	API.showTest();
});

// Install Router
// ------------------
new Router({
	controller: API
});


module.exports = API;
