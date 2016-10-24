import App from 'app';
import Backbone from 'backbone';
import Settings from 'settings';


export default {

	// Login URL
	loginURL: Settings.RootURL + '/login',

	// Logout URL
	logoutURL: Settings.RootURL + '/logout',


	// Requests user login
	login(user) {
		if (user instanceof Backbone.Model) {
			user = user.attributes;
		}
		return $.post(this.loginURL, {
			email: user.user.email,
			password: user.password
		});
	},

	// Requests user logout
	logout() {
		return $.post(this.logoutURL);
	}
};
