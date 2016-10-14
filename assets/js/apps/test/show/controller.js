import App from 'app';
import View from './view';


const Controller = {};

Controller.showTest = () => {
	const testView = new View.Test();
	App.rootView.showChildView('main', testView);
};

export default Controller;
