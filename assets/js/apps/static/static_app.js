var App = require('app');
var Marionette = require('backbone.marionette');
var Radio = require('backbone.radio');
var GlobalChannel = Radio.channel('global');


// Router
// ------------------
var Router = Marionette.AppRouter.extend({
	appRoutes: {
		'static/:view': 'showStaticView'
	}
});

// API
// ------------------
var API = {
	showStaticView: function(view) {
		require.ensure(['apps/static/show/controller'], function(require) {
			var ShowController = require('apps/static/show/controller');
			App.executeAction('StaticApp', ShowController.showStaticView, {
				view: view
			});
		});
	}
};

// Event Listeners
// ------------------
GlobalChannel.on('static:view:show', function(view) {
	App.navigate('static/' + view);
	API.showStaticView(view);
});

// Install Router
// ------------------
new Router({
	controller: API
});


module.exports = API;
