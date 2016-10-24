import App from 'app';
import View from './view';
import Authenticator from 'common/authenticator';
import Notify from 'common/notify';


const Controller = {
	showLogin() {

		const loginView = new View.Login();

		loginView.on('submit', data => {
			console.log(data);
			loginView.triggerMethod('clear:validation:errors');
			loginView.triggerMethod('show:preloader');
			
			// Log user in
			Authenticator.login(data).done(response => {

			}).fail(() => {

			});
		});

		loginView.on('cancel', () => {
			App.Nav.showLanding();
		});

		App.rootView.showChildView('main', loginView);
	}
};

export default Controller;
