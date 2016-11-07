import App from 'app';
import {Error404, Error500} from './view';

const Controller = {
	show404() {
		var errorView = new Error404();
		App.rootView.showChildView('main', errorView);
	},

	show500() {
		var errorView = new Error500();
		App.rootView.showChildView('main', errorView);
	}
};

export default Controller;
