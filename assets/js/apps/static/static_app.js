var App = require('app');
var Mn = require('backbone.marionette');
var Radio = require('backbone.radio');
var GC = Radio.channel('global');


// Router
// ------------------
var Router = Mn.AppRouter.extend({
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
			ShowController.showStaticView({
				view: view
			});
		});
	}
};

// Event Listeners
// ------------------
GC.on('static:view:show', function(view) {
	App.navigate('static/' + view);
	API.showStaticView(view);
});

// Install Router
// ------------------
new Router({
	controller: API
});


module.exports = API;
