import App from 'app';
import View from './view';

const Controller = {};

Controller.showMainLoader = function() {
	const loaderView = new View.Loader();
	App.rootView.showChildView('loading', loaderView);
};

Controller.hideMainLoader = function() {
	App.rootView.getRegion('loading').empty();
};

Controller.hideAllLoaders = function() {
	App.rootView.getRegion('loading').empty();
};

export default Controller;
