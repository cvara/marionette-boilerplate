import App from 'app';
import Mn from 'backbone.marionette';
import Radio from 'backbone.radio';
const GC = Radio.channel('global');


// Router
// ------------------
const Router = Mn.AppRouter.extend({
	appRoutes: {
		'users/login': 'showLogin'
	}
});

// API
// ------------------
const API = {
	showLogin(user) {
		require.ensure([], () => {
			const LoginController = require('./login/controller').default;
			LoginController.showLogin();
		});
	}
};

// Event Listeners
// ------------------
GC.on('users:login:show', function() {
	App.Nav.navigate('users/login');
	API.showLogin();
});

// Install Router
// ------------------
new Router({
	controller: API
});

export default API;
