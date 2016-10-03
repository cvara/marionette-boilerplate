var App = require('app');
var Mn = require('backbone.marionette');
var Radio = require('backbone.radio');
var GC = Radio.channel('global');


// Router
// ------------------
var Router = Mn.AppRouter.extend({
	appRoutes: {
		'splash': 'showSplash'
	}
});

// API
// ------------------
var API = {
	showSplash: function() {
		require.ensure(['apps/splash/show/controller'], function(require) {
			var ShowController = require('apps/splash/show/controller');
			App.executeAction('SplashApp', ShowController.showSplash);
		});
	}
};

// Event Listeners
// ------------------
GC.on('splash:show', function() {
	App.navigate('splash');
	API.showSplash();
});

// Install Router
// ------------------
new Router({
	controller: API
});


module.exports = API;
