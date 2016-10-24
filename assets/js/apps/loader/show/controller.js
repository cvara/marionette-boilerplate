import App from 'app';
import View from './view';

const Controller = {
	showMainLoader() {
		const loaderView = new View.Loader();
		App.rootView.showChildView('loading', loaderView);
	},

	hideMainLoader() {
		App.rootView.getRegion('loading').empty();
	},

	hideAllLoaders() {
		App.rootView.getRegion('loading').empty();
	}
};



export default Controller;
