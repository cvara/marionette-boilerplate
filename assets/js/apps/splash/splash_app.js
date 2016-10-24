import App from 'app';
import Mn from 'backbone.marionette';
import Radio from 'backbone.radio';
const GC = Radio.channel('global');


// Router
// ------------------
const Router = Mn.AppRouter.extend({
	appRoutes: {
		'splash': 'showSplash'
	}
});

// API
// ------------------
const API = {
	showSplash() {
		require.ensure([], () => {
			const ShowController = require('./show/controller').default;
			ShowController.showSplash();
		});
	}
};

// Event Listeners
// ------------------
GC.on('splash:show', () => {
	App.Nav.navigate('splash');
	API.showSplash();
});

// Install Router
// ------------------
new Router({
	controller: API
});

export default API;
