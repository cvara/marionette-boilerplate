import App from 'app';
import View from './view';


const Controller = {};

Controller.showSplash = () => {
	const splashView = new View.Splash();
	App.rootView.showChildView('main', splashView);
};

export default Controller;
