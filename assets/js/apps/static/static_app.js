import App from 'app';
import Mn from 'backbone.marionette';
import Radio from 'backbone.radio';
const GC = Radio.channel('global');


// Router
// ------------------
const Router = Mn.AppRouter.extend({
	appRoutes: {
		'static/:view': 'showStaticView'
	}
});

// API
// ------------------
const API = {
	showStaticView: (view) => {
		require.ensure([], () => {
			const ShowController = require('./show/controller').default;
			ShowController.showStaticView({
				view: view
			});
		});
	}
};

// Event Listeners
// ------------------
GC.on('static:view:show', view => {
	App.Nav.navigate('static/' + view);
	API.showStaticView(view);
});

// Install Router
// ------------------
new Router({
	controller: API
});

export default API;
