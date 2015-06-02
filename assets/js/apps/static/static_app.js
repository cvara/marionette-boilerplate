var App = require('app');


App.module('StaticApp', function(StaticApp, App, Backbone, Marionette, $, _) {
	StaticApp.startWithParent = false;

	StaticApp.onStart = function() {
		console.info('starting StaticApp');
	};

	StaticApp.onStop = function() {
		console.info('stopping StaticApp');
	};
});

App.module('Routers.StaticApp', function(UsersAppRouter, App, Backbone, Marionette, $, _) {

	// Users Router
	// ------------------
	UsersAppRouter.Router = Marionette.AppRouter.extend({
		appRoutes: {
			'static/:view': 'showStaticView'
		}
	});

	// Users API
	// ------------------
	var API = {
		showStaticView: function(view) {
			require.ensure(['apps/static/show/controller'], function(require) {
				var ShowController = require('apps/static/show/controller');
				App.executeAction('StaticApp', ShowController.showStaticView, {
					view: view
				});
				App.execute('sidebar:deactivate:all');
			});
		}
	};

	// Event Listeners
	// ------------------
	App.on('static:view:show', function(view) {
		App.navigate('static/' + view);
		API.showStaticView(view);
	});

	// Install Router
	// ------------------
	new UsersAppRouter.Router({
		controller: API
	});
});

module.exports = App.Routers.StaticApp;