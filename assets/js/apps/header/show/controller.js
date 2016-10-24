import App from 'app';
import Backbone from 'backbone';
import View from './view';
import Authenticator from 'common/authenticator';
import LoggedUser from 'data/logged.user';
import Radio from 'backbone.radio';
const GC = Radio.channel('global');


const Controller = {
	showHeader() {

		let user;

		const headerView = new View.Header();

		headerView.on('show:home', () => {
			App.Nav.showLanding(user);
		});

		headerView.on('logout:user', () => {
			Authenticator.logout().done(() => {
				GC.trigger('logout');
			});
		});

		GC.request('loggedUser:entity').then(loggedUser => {
			user = loggedUser;
			headerView.model = user;
			headerView.render();
		});

		App.rootView.showChildView('header', headerView);

	}
};

export default Controller;
