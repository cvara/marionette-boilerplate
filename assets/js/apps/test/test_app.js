import App from 'app';
import Mn from 'backbone.marionette';
import Radio from 'backbone.radio';
const GC = Radio.channel('global');


// Router
// ------------------
const Router = Mn.AppRouter.extend({
	appRoutes: {
		'test': 'showTest'
	}
});

// API
// ------------------
const API = {
	showTest() {
		require.ensure([], () => {
			const ShowController = require('./show/controller').default;
			ShowController.showTest();
		});
	}
};

// Event Listeners
// ------------------
GC.on('test:show', () => {
	App.Nav.navigate('test');
	API.showTest();
});

// Install Router
// ------------------
new Router({
	controller: API
});

export default API;
