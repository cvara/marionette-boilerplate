import App from 'app';
import View from './view';


const Controller = {
	showStaticView({view}) {
		const staticView = new View.StaticView({
			view: view
		});
		App.rootView.showChildView('main', staticView);
	}
};

export default Controller;
