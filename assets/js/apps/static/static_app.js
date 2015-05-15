// The controller is a NOT a top level requirement, since we must wait before
// the user navigates to a page managed by this app until we 'require' it
define(['app'], function(App) {

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
				require(['apps/static/show/controller'], function(Controller) {
					App.executeAction('StaticApp', Controller.showStaticView, {
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

	return App.Routers.StaticApp;
});